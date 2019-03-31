import {localStorage} from './localStorage';

export function versionDetector(tmpVersionKey, appVersion) {
  window.tmpVersionUpdate = function (flag) {
    document.getElementById('j_' + tmpVersionKey).remove();

    if (flag) {
      var val = String(encodeURIComponent(window[tmpVersionKey]));
      localStorage.set(tmpVersionKey, val);

      var date = new Date();
      date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
      val += '; expires=' + date.toUTCString();
      if (window.location.pathname.indexOf('/portal/publisher/') === 0) {
        val += '; domain=' + document.domain.split('.').slice(1).join('.');
      } else {
        val += '; domain=' + document.domain;
      }
      val += '; path=/';

      document.cookie = tmpVersionKey + '=' + val;

      window.location.reload(true);
    }
    // 已更新了，30分钟后继续探测
    setTimeout(window.tmpIntervalFunc, 1000 * 60 * 30);
  };
  window.tmpIntervalTick = function () {
    var tmpVersion = localStorage.get(tmpVersionKey);
    if (tmpVersion && window[tmpVersionKey] && tmpVersion !== window[tmpVersionKey]) {
      var tmpVs = window[tmpVersionKey].split('_');
      var tmpVersions = tmpVersion.split('_');
      if (tmpVs[0] === tmpVersions[0] || tmpVs[0] === appVersion) {
        var tmpDiv = document.createElement('div');
        tmpDiv.innerHTML = `<div id="j_${tmpVersionKey}" style="position: fixed; top: 0; z-index: 100000000; left: 50%; padding: 5px 20px; border: 1px solid #ffe58f; background-color: #fffbe6; width: 294px; margin-left: -147px; font-weight: bold;">
              您好，系统有更新，请点击<a onclick="window.tmpVersionUpdate(1);">刷新</a>页面。
              <a onclick="window.tmpVersionUpdate();" style="display: inline-block; *zoom: 1; *display: inline; width: 14px; height: 14px; opacity: 0.3;    position: absolute; border: 1px solid; border-radius: 7px; right: 4px; top: 7px;" >
                <i style=" position: absolute; right: 6px; top: 1px; height: 11px; width: 1px; background-color: #333; transform: rotate(45deg); "></i>
                <i style=" position: absolute; right: 6px; top: 1px; height: 11px; width: 1px; background-color: #333; transform: rotate(-45deg); "></i>
              </a>
            </div>`;
        document.body.appendChild(tmpDiv);
      }
    } else if (window[tmpVersionKey]) {
      localStorage.set(tmpVersionKey, window[tmpVersionKey]);
      // 没有识别到，30分钟后继续探测
      setTimeout(window.tmpIntervalFunc, 1000 * 60 * 30);
    }
  };

  var tickScript;
  window.tmpIntervalFunc = function () {
    if (tickScript) {
      tickScript.remove();
    }
    tickScript = document.createElement('script');
    tickScript.type = 'text/javascript';
    tickScript.src = window.__static_public_path__ + `../v.js?t=${+new Date().getTime()}`;
    tickScript.onload = window.tmpIntervalTick;
    document.head.appendChild(tickScript);
  };

  window.tmpIntervalFunc();
}
