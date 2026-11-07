(function bootstrapLuluAndroidBridge() {
  'use strict';

  var apiOrigin = 'https://lulu-ji.pages.dev';
  var localHosts = new Set(['localhost', '127.0.0.1']);

  // The app supports Android 7+, where an unupdated System WebView can be
  // missing APIs used by the production bundle even though its syntax parses.
  if (!Object.fromEntries) {
    Object.fromEntries = function fromEntries(entries) {
      var result = {};
      Array.from(entries).forEach(function assignEntry(entry) { result[entry[0]] = entry[1]; });
      return result;
    };
  }
  if (!Object.hasOwn) {
    Object.hasOwn = function hasOwn(object, property) {
      return Object.prototype.hasOwnProperty.call(Object(object), property);
    };
  }
  if (!Array.prototype.at) {
    Object.defineProperty(Array.prototype, 'at', {
      configurable: true,
      writable: true,
      value: function at(index) {
        var position = Math.trunc(Number(index) || 0);
        if (position < 0) position += this.length;
        return this[position];
      }
    });
  }
  if (!Array.prototype.flat) {
    Object.defineProperty(Array.prototype, 'flat', {
      configurable: true,
      writable: true,
      value: function flat(depth) {
        var level = depth === undefined ? 1 : Math.max(0, Math.trunc(Number(depth) || 0));
        return this.reduce(function flatten(result, item) {
          return result.concat(Array.isArray(item) && level > 0 ? item.flat(level - 1) : item);
        }, []);
      }
    });
  }
  if (!Array.prototype.flatMap) {
    Object.defineProperty(Array.prototype, 'flatMap', {
      configurable: true,
      writable: true,
      value: function flatMap(callback, thisArg) { return this.map(callback, thisArg).flat(1); }
    });
  }
  if (!String.prototype.replaceAll) {
    Object.defineProperty(String.prototype, 'replaceAll', {
      configurable: true,
      writable: true,
      value: function replaceAll(search, replacement) {
        if (search instanceof RegExp) {
          if (!search.global) throw new TypeError('replaceAll RegExp must be global');
          return this.replace(search, replacement);
        }
        return this.split(String(search)).join(String(replacement));
      }
    });
  }
  if (!window.queueMicrotask) {
    window.queueMicrotask = function queueMicrotask(callback) {
      Promise.resolve().then(callback).catch(function rethrow(error) {
        setTimeout(function throwAsync() { throw error; }, 0);
      });
    };
  }
  if (!crypto.randomUUID) {
    crypto.randomUUID = function randomUUID() {
      var bytes = new Uint8Array(16);
      if (crypto.getRandomValues) crypto.getRandomValues(bytes);
      else for (var index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
      bytes[6] = (bytes[6] & 15) | 64;
      bytes[8] = (bytes[8] & 63) | 128;
      var hex = Array.from(bytes, function toHex(value) { return value.toString(16).padStart(2, '0'); }).join('');
      return hex.slice(0, 8) + '-' + hex.slice(8, 12) + '-' + hex.slice(12, 16) + '-' + hex.slice(16, 20) + '-' + hex.slice(20);
    };
  }

  window.__LULU_CAPACITOR__ = Object.freeze({
    platform: 'android',
    release: 'v325-avatar-crop-group-avatar-review',
    build: 20260909007,
    wrapperRevision: 7,
    apiOrigin
  });
  window.__LULU_BOOT_TIMEOUT_MS__ = 30000;
  document.documentElement.classList.add('lulu-capacitor', 'lunara-standalone');

  var viewportStyle = document.createElement('style');
  viewportStyle.id = 'lulu-capacitor-viewport';
  viewportStyle.textContent = 'html.lulu-capacitor #app{position:fixed!important;inset:0!important;min-height:0!important}';
  document.head.appendChild(viewportStyle);

  var preserveStandaloneMode = function preserveStandaloneMode() {
    if (!document.documentElement.classList.contains('lunara-standalone')) {
      document.documentElement.classList.add('lunara-standalone');
    }
  };
  new MutationObserver(preserveStandaloneMode).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });

  if (localHosts.has(location.hostname) && new URL(location.href).searchParams.has('ui-preview')) {
    var localUrl = new URL(location.href);
    localUrl.searchParams.delete('ui-preview');
    history.replaceState(history.state, '', localUrl.href);
  }

  var nativeStoragePrefix = 'lunara-web-storage:';
  var fixedPersistentKeys = [
    'aip-mode',
    'aip-user',
    'aip-users',
    'aip-invite-activation-id',
    'aip-invite-token',
    'aip-invite-finalized',
    'aip-invite-verified-at'
  ];
  function persistentWebStorageKey(key) {
    return fixedPersistentKeys.indexOf(String(key)) >= 0 || /^sb-[a-z0-9]+-auth-token$/i.test(String(key));
  }
  function nativePreferences() {
    var capacitor = window.Capacitor;
    if (!capacitor || typeof capacitor.registerPlugin !== 'function') return null;
    try {
      return capacitor.Plugins && capacitor.Plugins.Preferences
        ? capacitor.Plugins.Preferences
        : capacitor.registerPlugin('Preferences');
    } catch (_) {
      return null;
    }
  }
  function installPersistentSessionMirror(preferences) {
    var storagePrototype = window.Storage && window.Storage.prototype;
    if (!preferences || !storagePrototype || storagePrototype.__lunaraPersistentSessionMirror) return;
    var originalSetItem = storagePrototype.setItem;
    var originalRemoveItem = storagePrototype.removeItem;
    var originalClear = storagePrototype.clear;
    storagePrototype.setItem = function mirroredSetItem(key, value) {
      if (this === window.localStorage && persistentWebStorageKey(key)) {
        Promise.resolve(preferences.set({ key: nativeStoragePrefix + String(key), value: String(value) })).catch(function ignoreNativeWrite() {});
      }
      return originalSetItem.apply(this, arguments);
    };
    storagePrototype.removeItem = function mirroredRemoveItem(key) {
      if (this === window.localStorage && persistentWebStorageKey(key)) {
        Promise.resolve(preferences.remove({ key: nativeStoragePrefix + String(key) })).catch(function ignoreNativeRemove() {});
      }
      return originalRemoveItem.apply(this, arguments);
    };
    storagePrototype.clear = function mirroredClear() {
      if (this === window.localStorage) {
        Promise.resolve(preferences.keys()).then(function removeMirroredKeys(result) {
          return Promise.all((result.keys || []).filter(function isMirrored(key) {
            return String(key).indexOf(nativeStoragePrefix) === 0;
          }).map(function removeMirrored(key) { return preferences.remove({ key: key }); }));
        }).catch(function ignoreNativeClear() {});
      }
      return originalClear.apply(this, arguments);
    };
    Object.defineProperty(storagePrototype, '__lunaraPersistentSessionMirror', { value: true });
  }
  function hydratePersistentSession(preferences) {
    if (!preferences) return Promise.resolve(false);
    installPersistentSessionMirror(preferences);
    var localKeys = Object.keys(localStorage).filter(persistentWebStorageKey);
    return Promise.resolve(preferences.keys()).then(function mergePersistentKeys(result) {
      var nativeKeys = (result.keys || []).filter(function isMirrored(key) {
        return String(key).indexOf(nativeStoragePrefix) === 0;
      }).map(function webKey(key) { return String(key).slice(nativeStoragePrefix.length); });
      var keys = Array.from(new Set(fixedPersistentKeys.concat(localKeys, nativeKeys)));
      return Promise.all(keys.map(function hydrateKey(key) {
        var localValue = localStorage.getItem(key);
        if (localValue !== null) {
          return preferences.set({ key: nativeStoragePrefix + key, value: localValue });
        }
        return preferences.get({ key: nativeStoragePrefix + key }).then(function restoreNativeValue(result) {
          if (typeof result.value === 'string') localStorage.setItem(key, result.value);
        });
      }));
    }).then(function hydrated() {
      window.dispatchEvent(new CustomEvent('lulu:native-session-ready'));
      return true;
    }).catch(function hydrationFailed(error) {
      console.warn('Android persistent session hydration failed', error);
      return false;
    });
  }
  window.__LULU_NATIVE_STORAGE_READY__ = hydratePersistentSession(nativePreferences());

  function nativeImageSaver() {
    var capacitor = window.Capacitor;
    if (!capacitor || typeof capacitor.registerPlugin !== 'function') return null;
    try {
      return capacitor.Plugins && capacitor.Plugins.LuluMedia
        ? capacitor.Plugins.LuluMedia
        : capacitor.registerPlugin('LuluMedia');
    } catch (_) {
      return null;
    }
  }
  window.__LULU_NATIVE_SAVE_IMAGE__ = function saveImageToAndroidGallery(options) {
    var saver = nativeImageSaver();
    if (!saver || typeof saver.saveImage !== 'function') return Promise.reject(new Error('系统相册保存能力不可用'));
    return Promise.resolve(saver.saveImage(options || {}));
  };

  function remoteApiUrl(value) {
    var url;
    try {
      url = new URL(String(value), location.href);
    } catch (_) {
      return null;
    }
    if (!localHosts.has(url.hostname) || !url.pathname.startsWith('/api/')) return null;
    return new URL(`${url.pathname}${url.search}${url.hash}`, apiOrigin).href;
  }

  var nativeFetch = window.fetch.bind(window);
  window.fetch = function luluCapacitorFetch(input, init) {
    var sourceUrl = input instanceof Request ? input.url : input;
    var targetUrl = remoteApiUrl(sourceUrl);
    if (!targetUrl) return nativeFetch(input, init);
    if (input instanceof Request) return nativeFetch(new Request(targetUrl, input), init);
    return nativeFetch(targetUrl, init);
  };

  var nativeOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function luluCapacitorXhrOpen(method, url) {
    var rest = Array.prototype.slice.call(arguments, 2);
    return nativeOpen.apply(this, [method, remoteApiUrl(url) || url].concat(rest));
  };

  window.addEventListener('DOMContentLoaded', function markCapacitorRuntime() {
    preserveStandaloneMode();
    if (document.body) document.body.classList.add('lulu-capacitor-runtime');
  }, { once: true });
})();
