"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cacher = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Cacher =
/*#__PURE__*/
function () {
  function Cacher() {
    _classCallCheck(this, Cacher);

    this._map = {};
  }

  _createClass(Cacher, [{
    key: "cache",
    value: function cache(params, dataOrFn) {
      var ns = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var noAllow = arguments.length > 3 ? arguments[3] : undefined;
      var arr = [];
      var isComplete = true;

      for (var key in params) {
        arr.push(params[key]);

        if (isComplete) {
          isComplete = !!params[key];
        }
      }

      var name = ns + ':' + arr.join(' ');

      if (!this._map[name]) {
        this._map[name] = typeof dataOrFn === 'function' ? dataOrFn(!noAllow || isComplete ? params : null) : dataOrFn;
      }

      return this._map[name];
    }
  }]);

  return Cacher;
}();

exports.Cacher = Cacher;