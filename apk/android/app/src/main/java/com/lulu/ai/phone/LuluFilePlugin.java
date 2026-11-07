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

/** 数据导出用：把 web 端的 blob 存成系统「下载」目录里的真实文件。 */
@CapacitorPlugin(name = "LuluFile")
public class LuluFilePlugin extends Plugin {

    @PluginMethod
    public void saveFile(PluginCall call) {
        try {
            String filename = call.getString("filename", "lunara-export-" + System.currentTimeMillis() + ".json");
            String base64 = call.getString("base64");
            String mime = call.getString("mime", "application/octet-stream");
            if (filename == null || filename.trim().isEmpty()) filename = "lunara-export.json";
            filename = filename.replaceAll("[\\\\/:*?\"<>|]", "_");
            if (base64 == null || base64.isEmpty()) {
                call.reject("缺少文件内容");
                return;
            }
            byte[] bytes = Base64.decode(base64, Base64.DEFAULT);

            String uriString;
            String path;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                ContentValues values = new ContentValues();
                values.put(MediaStore.Downloads.DISPLAY_NAME, filename);
                values.put(MediaStore.Downloads.MIME_TYPE, mime);
                values.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/Lunara");
                values.put(MediaStore.Downloads.IS_PENDING, 1);
                Uri uri = getContext().getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                if (uri == null) {
                    call.reject("无法创建下载条目");
                    return;
                }
                OutputStream out = getContext().getContentResolver().openOutputStream(uri);
                out.write(bytes);
                out.close();
                values.clear();
                values.put(MediaStore.Downloads.IS_PENDING, 0);
                getContext().getContentResolver().update(uri, values, null, null);
                uriString = uri.toString();
                path = "Download/Lunara/" + filename;
            } else {
                File dir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), "Lunara");
                if (!dir.exists()) dir.mkdirs();
                File file = new File(dir, filename);
                FileOutputStream out = new FileOutputStream(file);
                out.write(bytes);
                out.flush();
                out.close();
                MediaScannerConnection.scanFile(getContext(), new String[]{file.getAbsolutePath()}, new String[]{mime}, null);
                uriString = Uri.fromFile(file).toString();
                path = file.getAbsolutePath();
            }
            JSObject result = new JSObject();
            result.put("uri", uriString);
            result.put("path", path);
            result.put("saved", true);
            call.resolve(result);
        } catch (Exception error) {
            call.reject("保存文件失败：" + error.getMessage(), error);
        }
    }
}
