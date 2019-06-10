export class Cacher {
  constructor() {
    this._map = {};
  }
  cache(params, dataOrFn, ns = '') {
    const arr = [];
    for (let key in params) {
      arr.push(params[key]);
    }
    const name = ns + ':' + arr.join(' ');
    if (!this._map[name]) {
      this._map[name] = typeof dataOrFn === 'function' ? dataOrFn(params) : dataOrFn;
    }
    return this._map[name];
  }
}
