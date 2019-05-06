import {notification, message} from 'antd';
import {fallbackRoutes} from './fallbackRoutes';
import {crud} from 'beatle';
import {Layer} from '../layers';

export function bootstrap(app, getInitData, versionKey, inters) {
  message.config({
    top: 51
  });

  crud.console = {
    success: message.success,
    error: (msg, err) => {
      if (err) {
        if (!err.catched) {
          notification.error({message: msg, description: err.message});
        }
      } else {
        notification.error({message: 'ApiException', description: msg});
      }
    }
  };

  function proccessData(res) {
    if (res) {
      const message = res.error || res.errorMessage || res.errMsg || res.message;
      if (message) {
        return new Error(message && JSON.stringify(message, null, 2));
      } else {
        return res.data || null;
      }
    } else {
      return null;
    }
  }

  if (!app.ajax.set('beforeRequest')) {
    app
      .ajax
      .set('beforeRequest', (ajaxOption) => {
        if (ajaxOption.getMock) {
          return ajaxOption.getMock(ajaxOption);
        } else if (ajaxOption.mock) {
          Object.assign(ajaxOption, ajaxOption.mock);
        } else {
          return ajaxOption;
        }
      });
  }
  if (!app.ajax.set('catchError')) {
    app
      .ajax
      .set('catchError', (err) => {
        err.catched = true;
        notification.error({message: 'ApiException', description: err.message});
      });
  }
  if (!app.ajax.set('afterResponse')) {
    app
      .ajax
      .set('afterResponse', (res) => {
        if (inters) {
          for (let key in inters) {
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

  // fallback路由
  app.route(fallbackRoutes, false);
  let promise = getInitData && getInitData() || Promise.resolve({});
  promise = promise.then((ret = {}) => {
    const route = app.route('/');
    let routes;
    if (ret.scenes) {
      routes = Layer.createLayerRoutes(ret.scenes);
      route.routes = routes;
      app.setRoutes(routes, null, route);
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

bootstrap.getPrefix = (app, name) => {
  const o = window.CONFIG || {};
  const prefix = o.prefix || '';
  return prefix + (name ? '/' + name : '') || ((o.root || 'oa') + '/' + (name || app.appName));
};

bootstrap.getResolvePath = (app, name) => {
  const resolvePath = bootstrap.getPrefix(app, name);
  return resolvePath[0] === '/' ? resolvePath : '/' + resolvePath;
};
