import PropTypes from 'prop-types';
import urllib from 'url';
import {createLocation} from 'history';
import qs from 'qs';
export class RouteHelper {
  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  constructor(context) {
    this.history = context.history;
    this._fns = [];
    this.location = this.history.location;

    this.applyChange(null, location.pathname + location.search + location.hash);
    this.history.listen((location) => {
      this.location = location;
      this.applyChange(null, location.pathname + location.search + location.hash);
    });
  }

  replace(query) {
    const newLocation = createLocation(this.location.pathname);
    newLocation.query = Object.assign(this.location.query, query);
    this.history.replace(newLocation);
  }

  push(url, query) {
    // 解析url，并把queryStr解析为object
    if (Object(url) === url) {
      url = url.pathname + url.search + url.hash;
    }
    if (query) {
      const u = urllib.parse(url, true);
      u.search = qs.stringify(Object.assign(u.query || {}, query));
      delete u.query;
      url = urllib.format(u);
    }

    // 得到最后的url
    this.history.push(url, query);
  }

  watch(watcher, callback) {
    this._fns.push({
      watcher: watcher,
      callback: callback
    });
  }

  unwatch(watcher) {
    const index = this._fns.findIndex(cfg => cfg.watcher === watcher);
    this._fns.splice(index, 1);
  }

  applyChange(query, url) {
    let newState = {};
    if (url) {
      const u = urllib.parse(url, true);
      Object.assign(newState, u.query);
    }

    if (query) {
      Object.assign(newState, query);
    }

    try {
      let cfg;
      for (let i = 0, len = this._fns.length; i < len; i++) {
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
}
