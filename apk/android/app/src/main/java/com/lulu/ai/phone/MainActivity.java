package com.lulu.ai.phone;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.URLUtil;
import android.webkit.WebView;
import android.os.Environment;

import androidx.activity.OnBackPressedCallback;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class MainActivity extends BridgeActivity {

    private static final int REQ_POST_NOTIFICATIONS = 9301;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(LuluMediaPlugin.class);
        registerPlugin(LuluFilePlugin.class);
        super.onCreate(savedInstanceState);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
                && ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.POST_NOTIFICATIONS}, REQ_POST_NOTIFICATIONS);
        }

        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE
                | WindowManager.LayoutParams.SOFT_INPUT_STATE_UNCHANGED);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);

        setupWebView();
        setupBackNavigation();
        applyImmersiveMode();
    }

    private void applyImmersiveMode() {
        try {
            View decor = getWindow().getDecorView();
            WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(getWindow(), decor);
            if (controller != null) {
                controller.hide(WindowInsetsCompat.Type.systemBars());
                controller.setSystemBarsBehavior(
                        WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } catch (Throwable ignored) {
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) applyImmersiveMode();
    }

    private WebView webView() {
        Bridge bridge = getBridge();
        return bridge == null ? null : bridge.getWebView();
    }

    private void setupWebView() {
        final WebView view = webView();
        if (view == null) return;
        view.setOverScrollMode(View.OVER_SCROLL_NEVER);
        view.setVerticalScrollBarEnabled(false);
        view.setHorizontalScrollBarEnabled(false);
        // 数据导出兜底：http(s) 直链下载到系统「下载」目录（blob: 由 android-shim.js 交给 LuluFile）
        view.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition,
                                        String mimeType, long contentLength) {
                if (url == null || !url.startsWith("http")) return;
                final String target = url;
                final String ua = userAgent;
                final String cookies = CookieManager.getInstance().getCookie(target);
                final String mime = mimeType;
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            HttpURLConnection connection = (HttpURLConnection) new URL(target).openConnection();
                            connection.setRequestProperty("User-Agent", ua == null ? "" : ua);
                            if (cookies != null) connection.setRequestProperty("Cookie", cookies);
                            connection.connect();
                            InputStream input = connection.getInputStream();
                            File dir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                            if (!dir.exists()) dir.mkdirs();
                            File out = new File(dir, URLUtil.guessFileName(target, null, mime));
                            FileOutputStream stream = new FileOutputStream(out);
                            byte[] buffer = new byte[8192];
                            int read;
                            while ((read = input.read(buffer)) > 0) stream.write(buffer, 0, read);
                            stream.flush();
                            stream.close();
                            input.close();
                        } catch (Exception ignored) {
                        }
                    }
                }).start();
            }
        });
    }

    /**
     * 侧滑 / 返回键：先回上一页（WebView 历史 → SPA 路由），到根页面再最小化到后台，
     * 不会 finish()，所以左右边缘滑动不会把 App 直接关掉。
     */
    private void setupBackNavigation() {
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                WebView view = webView();
                if (view == null) {
                    moveTaskToBack(true);
                    return;
                }
                if (view.canGoBack()) {
                    view.goBack();
                    return;
                }
                view.evaluateJavascript(
                        "(function(){try{return window.__LULU_NATIVE_BACK__?String(window.__LULU_NATIVE_BACK__()):'false'}catch(e){return 'false'}})()",
                        value -> {
                            String result = value == null ? "" : value.replace("\"", "");
                            if (!"true".equals(result)) moveTaskToBack(true);
                        });
            }
        });
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQ_POST_NOTIFICATIONS) {
            boolean granted = grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED;
            WebView view = webView();
            if (view != null) {
                view.post(() -> view.evaluateJavascript(
                        "window.dispatchEvent(new CustomEvent('lulu:notification-permission',{detail:{granted:" + granted + "}}));",
                        null));
            }
        }
    }
}
