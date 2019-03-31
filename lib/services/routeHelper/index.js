"use strict";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var prop_types_1 = require("prop-types");

var url_1 = require("url");

var RouteHelper =
/** @class */
function () {
  function RouteHelper(context) {
    var _this = this;

    this._fns = [];
    var location = window.location;

    if (context.location) {
      this.location = context.location;
    } else {
      var u = url_1["default"].parse(location.search, true);
      this.location = this.context.router.createLocation(location.pathname);
      this.location.query = u.query;
    }

    this.applyChange(null, location.href);
    context.router.listen(function (location) {
      _this.location = location;

      _this.applyChange(null, location.href);
    });
  }

  RouteHelper.prototype.replace = function (query) {
    var newLocation = this.context.router.createLocation(this.location.pathname);
    newLocation.query = _extends(this.location.query, query);
    this.context.router.replace(newLocation);
  };

  RouteHelper.prototype.push = function (url) {
    this.context.router.push(url);
  };

  RouteHelper.prototype.watch = function (watcher, callback) {
    this._fns.push({
      watcher: watcher,
      callback: callback
    });
  };

  RouteHelper.prototype.unwatch = function (watcher) {
    var index = this._fns.findIndex(function (cfg) {
      return cfg.watcher === watcher;
    });

    this._fns.splice(index, 1);
  };

  RouteHelper.prototype.applyChange = function (query, url) {
    var newState = {};

    if (url) {
      var u = url_1["default"].parse(url, true);

      _extends(newState, u.query);
    }

    if (query) {
      _extends(newState, query);
    }

    try {
      var cfg = void 0;

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
  };

  RouteHelper.contextTypes = {
    router: prop_types_1["default"].object.isRequired
  };
  return RouteHelper;
}();

exports.RouteHelper = RouteHelper;