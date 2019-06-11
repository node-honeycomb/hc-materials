export class Cacher {
  constructor() {
    this._map = {};
  }
  cache(params, dataOrFn, ns = '', noAllow) {
    const arr = [];
    let isComplete = true;
    for (let key in params) {
      arr.push(params[key]);
      if (isComplete) {
        isComplete = !!params[key];
      }
    }
    const name = ns + ':' + arr.join(' ');
    if (!this._map[name]) {
      this._map[name] = typeof dataOrFn === 'function' ? dataOrFn(!noAllow || isComplete ? params : null) : dataOrFn;
    }
    return this._map[name];
  }
}
