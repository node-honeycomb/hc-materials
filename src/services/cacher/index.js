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
      this.set(name, () => {
        return typeof dataOrFn === 'function' ? dataOrFn(!noAllow || isComplete ? params : null) : dataOrFn;
      });
    }
    return this.get(name);
  }

  get(name) {
    return this._map[name];
  }

  set(name, dataOrFn) {
    this._map[name] = typeof dataOrFn === 'function' ? dataOrFn() : dataOrFn;
  }

  has(name) {
    return !!this.get(name);
  }
}
