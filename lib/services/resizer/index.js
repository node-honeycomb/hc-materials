"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Resizer = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// see: https://www.npmjs.com/package/vue-resize
var Resizer =
/*#__PURE__*/
function () {
  function Resizer() {
    _classCallCheck(this, Resizer);
  }

  _createClass(Resizer, [{
    key: "resize",
    value: function resize(el, callback) {
      var object = document.createElement('object');
      this._resizeObject = object;
      object.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
      object.setAttribute('aria-hidden', 'true');
      object.setAttribute('tabindex', -1);

      object.onload = function () {
        object.contentDocument.defaultView.addEventListener('resize', callback);
      };

      object.type = 'text/html';

      if (this.isIE) {
        el.appendChild(object);
      }

      object.data = 'about:blank';

      if (!this.isIE) {
        el.appendChild(object);
      }

      return function () {
        object.contentDocument.defaultView.removeEventListener('resize', callback);
      };
    }
  }, {
    key: "isIE",
    get: function get() {
      if (this._isIE === undefined) {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');

        if (msie > 0) {
          // IE 10 or older => return version number
          this._isIE = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');

        if (trident > 0) {
          // IE 11 => return version number
          var rv = ua.indexOf('rv:');
          this._isIE = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        var edge = ua.indexOf('Edge/');

        if (edge > 0) {
          // Edge (IE 12+) => return version number
          this._isIE = parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        } // other browser


        this._isIE = -1;
      }

      return this._isIE;
    }
  }]);

  return Resizer;
}();

exports.Resizer = Resizer;