import PropTypes from 'prop-types';
import urllib from 'url';
import {createLocation} from 'history';

export class RouteHelper {
  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  constructor(context) {
    this.history = context.history;
    this._fns = [];
    this.location = this.history.location;

    this.applyChange(null, location.href);
    this.history.listen((location) => {
      this.location = location;
      this.applyChange(null, location.href);
    });
  }

  replace(query) {
    const newLocation = createLocation(this.location.pathname);
    newLocation.query = Object.assign(this.location.query, query);
    this.history.replace(newLocation);
  }

  push(url) {
    this.history.push(url);
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
