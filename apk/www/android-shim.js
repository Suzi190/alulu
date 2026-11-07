/* Lunara AI - Android 原生能力垫片（Capacitor）
 * 1) 本地通知：把 Web Notification / ServiceWorker.showNotification 接到 @capacitor/local-notifications
 * 2) 数据导出：拦下 blob: 的 <a download> 点击，交给原生 LuluFile 写入「下载」目录
 * 3) 返回：暴露 __LULU_NATIVE_BACK__ 给 MainActivity，让侧滑/返回键先回上一页
 */
(function () {
  'use strict';
  var Cap = window.Capacitor;
  if (!Cap) return;
  function plugin(name) {
    try {
      if (Cap.Plugins && Cap.Plugins[name]) return Cap.Plugins[name];
      if (typeof Cap.registerPlugin === 'function') return Cap.registerPlugin(name);
    } catch (e) {}
    return null;
  }
  window.__LULU_ANDROID_SHIM__ = true;

  /* ---------------- 1. 本地通知 ---------------- */
  var LN = plugin('LocalNotifications');
  function scheduleNow(title, options) {
    options = options || {};
    if (!LN) return Promise.resolve();
    try { LN.requestPermissions().catch(function () {}); } catch (e) {}
    return Promise.resolve(LN.schedule({
      notifications: [{
        id: Math.floor(Math.random() * 2000000000) + 1,
        title: String(title || 'Lunara AI'),
        body: String(options.body || ''),
        schedule: { at: new Date(Date.now() + 900) },
        smallIcon: 'ic_stat_lulu',
        extra: { route: (options.data && options.data.route) || '' }
      }]
    })).catch(function (err) { try { console.warn('[lulu] local notification failed', err); } catch (e) {} });
  }
  if (LN) {
    try { LN.requestPermissions().catch(function () {}); } catch (e) {}
    try {
      if (window.ServiceWorkerRegistration && ServiceWorkerRegistration.prototype) {
        ServiceWorkerRegistration.prototype.showNotification = function (title, options) {
          return scheduleNow(title, options);
        };
      }
      if (!navigator.serviceWorker) {
        Object.defineProperty(navigator, 'serviceWorker', {
          configurable: true,
          value: {
            ready: Promise.resolve({ showNotification: scheduleNow }),
            controller: null,
            register: function () { return Promise.resolve({ showNotification: scheduleNow }); },
            getRegistration: function () { return Promise.resolve(null); },
            getRegistrations: function () { return Promise.resolve([]); },
            addEventListener: function () {},
            removeEventListener: function () {}
          }
        });
      }
    } catch (e) {}
    function NotificationShim(title, options) {
      options = options || {};
      this.title = String(title || '');
      this.body = String(options.body || '');
      this.data = options.data || {};
      this.tag = options.tag || '';
      this.onclick = null;
      this.onclose = null;
      this.onerror = null;
      this.close = function () {};
      scheduleNow(title, options);
    }
    NotificationShim.permission = 'granted';
    NotificationShim.maxActions = 0;
    NotificationShim.requestPermission = function () {
      try { return LN.requestPermissions().then(function () { return 'granted'; }, function () { return 'granted'; }); }
      catch (e) { return Promise.resolve('granted'); }
    };
    try { window.Notification = NotificationShim; } catch (e) {}
    try { Object.defineProperty(window, '__LULU_NOTIFICATION_READY__', { value: true }); } catch (e) {}
  }

  /* ---------------- 2. 数据导出：blob -> 原生保存 ---------------- */
  var LF = plugin('LuluFile');
  if (LF) {
    var blobStore = (typeof Map === 'function') ? new Map() : null;
    var originalCreate = URL.createObjectURL;
    var originalRevoke = URL.revokeObjectURL;
    if (blobStore && originalCreate) {
      URL.createObjectURL = function (obj) {
        var url = originalCreate.call(URL, obj);
        try { if (obj instanceof Blob) blobStore.set(url, obj); } catch (e) {}
        return url;
      };
      URL.revokeObjectURL = function (url) {
        try { blobStore['delete'](url); } catch (e) {}
        return originalRevoke.apply(URL, arguments);
      };
      var originalClick = HTMLAnchorElement.prototype.click;
      HTMLAnchorElement.prototype.click = function () {
        var name = this.getAttribute ? this.getAttribute('download') : null;
        var href = String(this.href || '');
        var blob = name ? blobStore.get(href) : null;
        if (!name || !blob) return originalClick.apply(this, arguments);
        var mime = blob.type || 'application/octet-stream';
        var reader = new FileReader();
        reader.onloadend = function () {
          var dataUrl = String(reader.result || '');
          var base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
          if (!base64) return;
          Promise.resolve(LF.saveFile({ filename: name, base64: base64, mime: mime }))
            .catch(function (err) { try { console.warn('[lulu] saveFile failed', err); } catch (e) {} });
        };
        reader.readAsDataURL(blob);
        return undefined;
      };
    }
  }

  /* ---------------- 3. 返回上一页 ---------------- */
  window.__LULU_NATIVE_BACK__ = function () {
    try {
      if (window.__LULU_ROUTER_BACK__) return !!window.__LULU_ROUTER_BACK__();
      if (history.length > 1) { history.back(); return true; }
      var path = String(location.pathname || '/');
      if (path !== '/' && path !== '/desktop' && path !== '/index.html') { location.href = '/desktop'; return true; }
    } catch (e) {}
    return false;
  };
  /* ---------------- 4. 键盘不挡输入框 ---------------- */
  try {
    var vv = window.visualViewport;
    if (vv) {
      var baseHeight = vv.height;
      vv.addEventListener('resize', function () {
        var keyboardOpen = vv.height < baseHeight - 120;
        if (keyboardOpen) {
          var el = document.activeElement;
          if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) {
            setTimeout(function () {
              try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
              catch (e) { try { el.scrollIntoView(); } catch (e2) {} }
            }, 140);
          }
        }
      });
    }
  } catch (e) {}

  /* ---------------- 5. 通知权限回调 ---------------- */
  window.addEventListener('lulu:notification-permission', function (event) {
    try {
      var granted = !!(event && event.detail && event.detail.granted);
      window.__LULU_NOTIFY_GRANTED__ = granted;
      console.log('[lulu] notification permission:', granted);
    } catch (e) {}
  });
})();
