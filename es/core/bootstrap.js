function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import { notification, message } from 'antd';
import { fallbackRoutes } from './fallbackRoutes';
import { crud } from 'beatle';
import { Layer } from '../layers';
export function bootstrap(app, getInitData, versionKey, inters) {
  message.config({
    top: 51
  });
  crud.console = {
    success: message.success,
    error: function error(msg, err) {
      if (err) {
        if (!err.catched) {
          notification.error({
            message: msg,
            description: err.message
          });
        }
      } else {
        notification.error({
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
      var message = err.response ? err.response.message : err.message;

      if (cacheMsg === message) {
        clearTimeout(timer);
      }

      cacheMsg = message;
      timer = setTimeout(function () {
        notification.error({
          message: 'ApiException',
          description: message
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
  }

  var promise = getInitData && getInitData() || Promise.resolve({});
  promise = promise.then(function () {
    var ret = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var route = app.route('/');
    var routes;

    if (ret.scenes) {
      routes = Layer.createLayerRoutes(ret.scenes);
      route.routes = routes;
      app.setRoutes(routes, null, route);
    } // fallback路由


    if (app.setting.level > 1) {
      app.route(fallbackRoutes, false);
    } else {
      if (route.routes) {
        fallbackRoutes.forEach(function (item) {
          return route.routes.push(item);
        });
      } else {
        route.routes = fallbackRoutes;
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