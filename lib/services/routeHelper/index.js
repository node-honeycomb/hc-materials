"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RouteHelper = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _url = _interopRequireDefault(require("url"));

var _history = require("history");

var _qs = _interopRequireDefault(require("qs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RouteHelper =
/*#__PURE__*/
function () {
  function RouteHelper(context) {
    var _this = this;

    _classCallCheck(this, RouteHelper);

    this.history = context.history;
    this._fns = [];
    this.location = this.history.location;
    this.applyChange(null, location.pathname + location.search + location.hash);
    this.history.listen(function (location) {
      _this.location = location;

      _this.applyChange(null, location.pathname + location.search + location.hash);
    });
  }

  _createClass(RouteHelper, [{
    key: "replace",
    value: function replace(query) {
      var newLocation = (0, _history.createLocation)(this.location.pathname);
      newLocation.query = _extends(this.location.query, query);
      this.history.replace(newLocation);
    }
  }, {
    key: "push",
    value: function push(url, query, force) {
      // 解析url，并把queryStr解析为object
      if (Object(url) === url) {
        url = url.pathname + url.search + url.hash;
      }

      if (query) {
        var u = _url["default"].parse(url, true);

        u.search = _qs["default"].stringify(_extends(u.query || {}, query));
        delete u.query;
        url = _url["default"].format(u);
      } // 得到最后的url


      this.history.push(url, force ? query : null);
    }
  }, {
    key: "watch",
    value: function watch(watcher, callback) {
      this._fns.push({
        watcher: watcher,
        callback: callback
      });
    }
  }, {
    key: "unwatch",
    value: function unwatch(watcher) {
      var index = this._fns.findIndex(function (cfg) {
        return cfg.watcher === watcher;
      });

      this._fns.splice(index, 1);
    }
  }, {
    key: "applyChange",
    value: function applyChange(query, url) {
      var newState = {};

      if (url) {
        var u = _url["default"].parse(url, true);

        _extends(newState, u.query);
      }

      if (query) {
        _extends(newState, query);
      }

      try {
        var cfg;

        for (var i = 0, len = this._fns.length; i < len; i++) {
          cfg = this._fns[i];

          if (cfg.watcher(newState, this.state)) {
            cfg.callback(newState);
          }
        }
      } catch (e) {
        window.console.error(e);
      }

      this.state = newState;
    }
  }]);

  return RouteHelper;
}();

exports.RouteHelper = RouteHelper;
RouteHelper.contextTypes = {
  history: _propTypes["default"].object.isRequired
};