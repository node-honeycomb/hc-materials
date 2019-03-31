"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var antd_1 = require("antd");

var fallbackRoutes_1 = require("./fallbackRoutes");

var beatle_1 = require("beatle");

var layers_1 = require("../layers");

function bootstrap(app, getInitData, versionKey, inters) {
  antd_1.message.config({
    top: 51
  });
  beatle_1.crud.console = {
    success: antd_1.message.success,
    error: function error(msg, err) {
      if (err) {
        if (!err.catched) {
          antd_1.Notification.error({
            message: msg,
            description: err.message
          });
        }
      } else {
        antd_1.Notification.error({
          message: 'ApiException',
          description: msg
        });
      }
    }
  };

  function proccessData(res) {
    if (res) {
      var message_1 = res.error || res.errorMessage || res.errMsg || res.message;

      if (message_1) {
        return new Error(message_1 && JSON.stringify(message_1, null, 2));
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
      antd_1.Notification.error({
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