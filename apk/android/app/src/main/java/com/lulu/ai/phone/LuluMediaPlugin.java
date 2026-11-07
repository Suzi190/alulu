package com.lulu.ai.phone;

import android.content.ContentValues;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.UUID;

/** 把 web 端产生的图片写进系统相册（对齐 web 端 window.__LULU_NATIVE_SAVE_IMAGE__）。 */
@CapacitorPlugin(name = "LuluMedia")
public class LuluMediaPlugin extends Plugin {

    @PluginMethod
    public void saveImage(PluginCall call) {
        try {
            String dataUrl = call.getString("dataUrl");
            String base64 = call.getString("base64");
            String mime = call.getString("mime", "image/png");
            String filename = call.getString("filename");
            if (base64 == null && dataUrl != null) {
                int comma = dataUrl.indexOf(',');
                if (comma > 0) {
                    String header = dataUrl.substring(0, comma);
                    if (header.contains(":")) mime = header.substring(header.indexOf(':') + 1, header.indexOf(';') > 0 ? header.indexOf(';') : header.length());
                    base64 = dataUrl.substring(comma + 1);
                }
            }
            if (base64 == null || base64.isEmpty()) {
                call.reject("缺少图片数据");
                return;
            }
            byte[] bytes = Base64.decode(base64, Base64.DEFAULT);
            String ext = mime.contains("jpeg") || mime.contains("jpg") ? "jpg" : mime.contains("webp") ? "webp" : "png";
            String name = (filename == null || filename.trim().isEmpty())
                    ? "lulu-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 6) + "." + ext
                    : filename.trim();

            String uriString;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                ContentValues values = new ContentValues();
                values.put(MediaStore.Images.Media.DISPLAY_NAME, name);
                values.put(MediaStore.Images.Media.MIME_TYPE, mime);
                values.put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/Lunara");
                values.put(MediaStore.Images.Media.IS_PENDING, 1);
                Uri uri = getContext().getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
                if (uri == null) {
                    call.reject("无法创建相册条目");
                    return;
                }
                OutputStream out = getContext().getContentResolver().openOutputStream(uri);
                out.write(bytes);
                out.close();
                values.clear();
                values.put(MediaStore.Images.Media.IS_PENDING, 0);
                getContext().getContentResolver().update(uri, values, null, null);
                uriString = uri.toString();
            } else {
                File dir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES), "Lunara");
                if (!dir.exists()) dir.mkdirs();
                File file = new File(dir, name);
                FileOutputStream out = new FileOutputStream(file);
                out.write(bytes);
                out.flush();
                out.close();
                MediaScannerConnection.scanFile(getContext(), new String[]{file.getAbsolutePath()}, new String[]{mime}, null);
                uriString = Uri.fromFile(file).toString();
            }
            JSObject result = new JSObject();
            result.put("uri", uriString);
            result.put("saved", true);
            call.resolve(result);
        } catch (Exception error) {
            call.reject("保存图片失败：" + error.getMessage(), error);
        }
    }
}
