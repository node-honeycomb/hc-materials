"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
}); // see: https://www.npmjs.com/package/vue-resize

var Resizer =
/** @class */
function () {
  function Resizer() {}

  Object.defineProperty(Resizer.prototype, "isIE", {
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
    },
    enumerable: true,
    configurable: true
  });

  Resizer.prototype.resize = function (el, callback) {
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
  };

  return Resizer;
}();

exports.Resizer = Resizer;