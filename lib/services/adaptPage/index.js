"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var w = window;
var documentElement = document.documentElement;
var body = document.body;

var AdaptPage =
/** @class */
function () {
  function AdaptPage() {
    var _this = this;

    this._offsetHeight = 0;
    this._isInIframe = AdaptPage.inIframe();
    this._watchers = [];

    this._adapter = function () {
      clearTimeout(_this._timer);
      _this._timer = setTimeout(function () {
        var index = 0;
        var watcher = _this._watchers[index];

        while (watcher) {
          if (!watcher.el || watcher.el.offsetParent === null) {
            _this._watchers.splice(index, 1);
          } else {
            watcher.fn(watcher.el);
            index++;
          }

          watcher = _this._watchers[index];
        }
      }, 200);
    };
    /**
     * + add resize
     * see: http://stackoverflow.com/questions/19014250/reactjs-rerender-on-browser-resize
     */


    window.addEventListener('resize', this._adapter);
  }
  /**
   * identify in an iframe
   * see: http://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
   */


  AdaptPage.inIframe = function () {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  };

  AdaptPage.prototype.setOffsetHeight = function (offsetHeight) {
    this._offsetHeight = offsetHeight;
  };

  AdaptPage.prototype.getScreenHeight = function () {
    return (w.innerHeight || documentElement.clientHeight || body.clientHeight) - this._offsetHeight;
  };

  AdaptPage.prototype.onAdapt = function (el, callback) {
    this._watchers.push({
      el: el,
      fn: callback
    });

    callback(el, this._isInIframe);
  };

  AdaptPage.prototype.autoAdaptDim = function (el, setter) {
    var _this = this;

    var callback = function callback(el, isInIframe) {
      setter(el.offsetHeight - _this._offsetHeight, isInIframe, _this.getScreenHeight());
    };

    this.onAdapt(el, callback);
  };

  AdaptPage.prototype.autoAdapt = function (dom, action) {
    this.autoAdaptDim(dom, function (size, isInIframe, screenHeight) {
      action(size, screenHeight, isInIframe);
    });
  };

  AdaptPage.prototype.dispose = function () {
    this._watchers = [];
    window.removeEventListener('resize', this._adapter);
  };

  return AdaptPage;
}();

exports.AdaptPage = AdaptPage;