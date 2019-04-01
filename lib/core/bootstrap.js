"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var notification_1 = require("antd/lib/notification");

var message_1 = require("antd/lib/message");

var fallbackRoutes_1 = require("./fallbackRoutes");

var beatle_1 = require("beatle");

var layers_1 = require("../layers");

function bootstrap(app, getInitData, versionKey, inters) {
  message_1["default"].config({
    top: 51
  });
  beatle_1.crud.console = {
    success: message_1["default"].success,
    error: function error(msg, err) {
      if (err) {
        if (!err.catched) {
          notification_1["default"].error({
            message: msg,
            description: err.message
          });
        }
      } else {
        notification_1["default"].error({
          message: 'ApiException',
          description: msg
        });
      }
    }
  };

  function proccessData(res) {
    if (res) {
      var message_2 = res.error || res.errorMessage || res.errMsg || res.message;

      if (message_2) {
        return new Error(message_2 && JSON.stringify(message_2, null, 2));
      } else {
        return res.data || null;
      }
    } else {
      return null;
    }
  }

  app.ajax.set('beforeRequest', function (ajaxOption) {
    if (ajaxOption.getMock || ajaxOption.mock) {
      return Promise.resolve(ajaxOption.getMock ? ajaxOption.getMock(ajaxOption) : ajaxOption.mock);
    } else {
      return ajaxOption;
    }
  });
  app.ajax.set('afterResponse', function (res, option, xhr) {
    xhr["catch"](function (err) {
      err.catched = true;
      notification_1["default"].error({
        message: 'ApiException',
        description: err.message
      });
    });

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
  }); // fallback路由

  app.route(fallbackRoutes_1.fallbackRoutes, false);
  var promise = getInitData && getInitData() || Promise.resolve({});
  promise = promise.then(function (ret) {
    if (ret === void 0) {
      ret = {};
    }

    var route = app.route('/');
    var childRoutes;

    if (ret.scenes) {
      childRoutes = layers_1.Layer.createLayerRoutes(ret.scenes);
      route.childRoutes = childRoutes;
      app.setRoutes(childRoutes, null, route);
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

exports.bootstrap = bootstrap;

bootstrap.getPrefix = function (app, name) {
  var o = window.CONFIG || {};
  var prefix = o.prefix || '';
  return prefix + (name ? '/' + name : '') || (o.root || 'oa') + '/' + (name || app.appName);
};

bootstrap.getResolvePath = function (app, name) {
  var resolvePath = bootstrap.getPrefix(app, name);
  return resolvePath[0] === '/' ? resolvePath : '/' + resolvePath;
};