function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var w = window;
var documentElement = document.documentElement;
var body = document.body;
export var AdaptPage =
/*#__PURE__*/
function () {
  _createClass(AdaptPage, [{
    key: "setOffsetHeight",
    value: function setOffsetHeight(offsetHeight) {
      this._offsetHeight = offsetHeight;
    }
  }, {
    key: "getScreenHeight",
    value: function getScreenHeight() {
      return (w.innerHeight || documentElement.clientHeight || body.clientHeight) - this._offsetHeight;
    }
  }], [{
    key: "inIframe",

    /**
     * identify in an iframe
     * see: http://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
     */
    value: function inIframe() {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    }
  }]);

  function AdaptPage() {
    var _this = this;

    _classCallCheck(this, AdaptPage);

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

  _createClass(AdaptPage, [{
    key: "onAdapt",
    value: function onAdapt(el, callback) {
      this._watchers.push({
        el: el,
        fn: callback
      });

      callback(el, this._isInIframe);
    }
  }, {
    key: "autoAdaptDim",
    value: function autoAdaptDim(el, setter) {
      var _this2 = this;

      var callback = function callback(el, isInIframe) {
        setter(el.offsetHeight - _this2._offsetHeight, isInIframe, _this2.getScreenHeight());
      };

      this.onAdapt(el, callback);
    }
  }, {
    key: "autoAdapt",
    value: function autoAdapt(dom, action) {
      this.autoAdaptDim(dom, function (size, isInIframe, screenHeight) {
        action(size, screenHeight, isInIframe);
      });
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this._watchers = [];
      window.removeEventListener('resize', this._adapter);
    }
  }]);

  return AdaptPage;
}();