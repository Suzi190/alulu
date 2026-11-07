# Lunara AI · Android APK（Capacitor）

这个仓库是「Lunara AI 小手机」的 Android 打包工程，Web 资源在 `www/`，原生壳在 `android/`，APK 由 GitHub Actions 自动构建。

## 一、四条需求怎么实现的

| 需求 | 实现位置 | 说明 |
|---|---|---|
| **1. 全屏沉浸 + 键盘不挡输入框** | `MainActivity.applyImmersiveMode()`、`res/values/styles.xml`、`AndroidManifest.xml`、`www/android-shim.js` | 系统栏用 `WindowInsetsControllerCompat.hide(systemBars)` + `BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE` 隐藏（边缘上划可临时唤出）；刘海区 `shortEdges` 铺满；**没有用 edge-to-edge**，所以 `decorFitsSystemWindows=true` + `windowSoftInputMode=adjustResize` 仍然生效，键盘弹起时窗口收缩、输入框不会被盖住；`android-shim.js` 再补一层：`visualViewport` 变矮（键盘弹起）时把当前输入框 `scrollIntoView({block:'center'})`。没有设置 `Keyboard.resize:none`，也没有 `captureInput`，输入框不被锁。 |
| **2. 数据导入导出正常** | `www/android-shim.js` + `LuluFilePlugin.java` + `MainActivity.setDownloadListener` | Web 端导出是 `URL.createObjectURL(blob)` + `<a download>.click()`，WebView 里这条链路是死的。垫片把 `createObjectURL` 产生的 blob 缓存下来，拦截 `HTMLAnchorElement.prototype.click`，把 blob 读成 base64 交给原生 `LuluFile.saveFile` → 写入 `Download/Lunara/xxx.json`（Android 10+ 走 MediaStore，免存储权限）。导入走 `<input type="file">`，Capacitor 的 `onShowFileChooser` 原生支持，无需改动。导入导出都通过 `@capacitor/preferences` 镜像 `aip-*` 关键键，重装/清缓存后登录态与数据仍在。 |
| **3. 侧滑不退出，回上一页** | `MainActivity.setupBackNavigation()` + `www/android-shim.js` | 注册 `OnBackPressedCallback`：`webView.canGoBack()` → `goBack()`（SPA 的 pushState 历史就是上一页）；否则执行 `window.__LULU_NATIVE_BACK__()`（`history.back()`，到根路由前再拦一次）；只有到根页面且无历史时才 `moveTaskToBack(true)` 退到后台——**任何情况下都不调用 `finish()`**，所以左右边缘滑动不会把 App 关掉。 |
| **4. 开放本地通知权限** | `AndroidManifest.xml`、`MainActivity.onCreate`、`www/android-shim.js`、`@capacitor/local-notifications` | Manifest 声明 `POST_NOTIFICATIONS` / `VIBRATE` / `WAKE_LOCK` / `SCHEDULE_EXACT_ALARM` / `USE_EXACT_ALARM` / `RECEIVE_BOOT_COMPLETED`；Android 13+ 首次启动弹系统授权框；垫片把 `window.Notification` 和 `ServiceWorkerRegistration.prototype.showNotification` 接到原生 LocalNotifications，Web 端原有的「通知测试/主动联系提醒」直接可用（权限状态回填到 `window.__LULU_NOTIFY_GRANTED__`）。 |

## 二、用 GitHub 出 APK（3 步）

1. 在 GitHub 新建一个空仓库（不要勾选 README，公开/私有都行）。
2. 把本目录推上去：
   ```bash
   git remote add origin https://github.com/<你的用户名>/<仓库名>.git
   git branch -M main
   git push -u origin main
   ```
3. 打开仓库的 **Actions** → 左侧 **Build Lunara AI APK** → 等 3~5 分钟 → 在运行详情页底部 **Artifacts** 下载 `lunara-ai-apk.zip`，解压得到 `app-debug.apk`，传到手机安装（需要允许"安装未知来源应用"）。

> 之后每次 `git push` 都会自动重新构建。

## 三、本地构建（可选，需要 JDK 17 + Android SDK）

```bash
npm install
npx cap sync android
cd android && ./gradlew assembleDebug
# 产物：android/app/build/outputs/apk/debug/app-debug.apk
```

## 四、要改的地方

- App 名称/包名：`capacitor.config.json` 的 `appName` / `appId`（改 `appId` 后要同步改 `android/app/build.gradle` 的 `namespace` 与 `applicationId`，并移动 `java/com/lulu/ai/phone` 目录）。
- 后端地址：`www/native-bridge.js` 第一行 `var apiOrigin = 'https://lulu-ji.pages.dev'`，`/api/*` 请求会被重写到这个域名。
- 通知图标：`android/app/src/main/res/drawable/ic_stat_lulu.xml`（单色 vector，状态栏要求纯白剪影）。
- 正式签名包：把 keystore 放进仓库 Secrets，取消 `.github/workflows/build-apk.yml` 里 release 步骤的注释。

## 五、已知限制

- 本工程只带 `@capacitor/preferences` + `@capacitor/local-notifications` 两个官方插件；`capacitor.config.json` 里的 `SplashScreen` / `Keyboard` / `StatusBar` / `SystemBars` 配置项因为没有装对应插件会被忽略（沉浸式改由 `MainActivity` 原生实现）。
- `www/` 是构建产物（已改：去掉邀请码/账密门禁、加 SillyTavern 角色卡/世界书/正则导入），源码不在此仓库。
- 通知是「本地通知」（`schedule` 到点弹出），不是 FCM 远程推送；App 被系统冻结时，长时间后台的定时提醒可能延后。

<!-- rebuild trigger 2026-11-07T14:50:39.9850974+08:00 -->
