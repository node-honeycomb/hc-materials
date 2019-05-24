"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bootstrap = bootstrap;

var _antd = require("antd");

var _fallbackRoutes = require("./fallbackRoutes");

var _beatle = require("beatle");

var _layers = require("../layers");

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function bootstrap(app, getInitData, versionKey, inters) {
  _antd.message.config({
    top: 51
  });

  _beatle.crud.console = {
    success: _antd.message.success,
    error: function error(msg, err) {
      if (err) {
        if (!err.catched) {
          _antd.notification.error({
            message: msg,
            description: err.message
          });
        }
      } else {
        _antd.notification.error({
          message: 'ApiException',
          description: msg
        });
      }
    }
  };

  function proccessData(res) {
    if (res) {
      var _message = res.error || res.errorMessage || res.errMsg || res.message;

      if (_message) {
        return new Error(_message && JSON.stringify(_message, null, 2));
      } else {
        return res.data || null;
      }
    } else {
      return null;
    }
  }

  if (!app.ajax.set('beforeRequest')) {
    app.ajax.set('beforeRequest', function (ajaxOption) {
      if (ajaxOption.getMock) {
        return ajaxOption.getMock(ajaxOption);
      } else if (ajaxOption.mock) {
        _extends(ajaxOption, ajaxOption.mock);
      } else {
        return ajaxOption;
      }
    });
  }

  if (!app.ajax.set('catchError')) {
    var cacheMsg;
    var timer;
    app.ajax.set('catchError', function (err) {
      err.catched = true;

      if (cacheMsg === err.message) {
        clearTimeout(timer);
      }

      cacheMsg = err.message;
      timer = setTimeout(function () {
        _antd.notification.error({
          message: 'ApiException',
          description: err.message
        });
      }, 10);
    });
  }

  if (!app.ajax.set('afterResponse')) {
    app.ajax.set('afterResponse', function (res) {
      if (inters) {
        for (var key in inters) {
          res = inters[key](res, app);

          if (res instanceof Error) {
            return res;
          }
        }
      } else {
        res = proccessData(res, app);
      }

      return res;
    });
  } // fallback路由
  // app.route(fallbackRoutes, false);


  var promise = getInitData && getInitData() || Promise.resolve({});
  promise = promise.then(function () {
    var ret = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var route = app.route('/');
    var routes;

    if (ret.scenes) {
      routes = _layers.Layer.createLayerRoutes(ret.scenes);
      route.routes = routes;
      app.setRoutes(routes, null, route);
    } else {
      if (route.routes) {
        _fallbackRoutes.fallbackRoutes.forEach(function (item) {
          return route.routes.push(item);
        });
      } else {
        route.routes = _fallbackRoutes.fallbackRoutes;
      }
    }

    return {
      versionKey: versionKey,
      prefix: bootstrap.getPrefix(app),
      dom: document.getElementById('main')
    };
  });
  return function ready(callback) {
    promise.then(callback);
  };
}

bootstrap.getPrefix = function (app, name) {
  var o = window.CONFIG || {};
  var prefix = o.prefix || '';
  return prefix + (name ? '/' + name : '') || (o.root || 'oa') + '/' + (name || app.appName);
};

bootstrap.getResolvePath = function (app, name) {
  var resolvePath = bootstrap.getPrefix(app, name);
  return resolvePath[0] === '/' ? resolvePath : '/' + resolvePath;
};