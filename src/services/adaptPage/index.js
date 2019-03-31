const w = window;
const documentElement = document.documentElement;
const body = document.body;

export class AdaptPage {
  /**
   * identify in an iframe
   * see: http://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
   */
  static inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  setOffsetHeight(offsetHeight) {
    this._offsetHeight = offsetHeight;
  }

  getScreenHeight() {
    return (w.innerHeight || documentElement.clientHeight || body.clientHeight) - this._offsetHeight;
  }

  constructor() {
    this._offsetHeight = 0;
    this._isInIframe = AdaptPage.inIframe();
    this._watchers = [];
    this._adapter = () => {
      clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        let index = 0;
        let watcher = this._watchers[index];
        while (watcher) {
          if (!watcher.el || watcher.el.offsetParent === null) {
            this
              ._watchers
              .splice(index, 1);
          } else {
            watcher.fn(watcher.el);
            index++;
          }
          watcher = this._watchers[index];
        }
      }, 200);
    };

    /**
     * + add resize
     * see: http://stackoverflow.com/questions/19014250/reactjs-rerender-on-browser-resize
     */
    window.addEventListener('resize', this._adapter);
  }

  onAdapt(el, callback) {
    this
      ._watchers
      .push({el: el, fn: callback});
    callback(el, this._isInIframe);
  }

  autoAdaptDim(el, setter) {
    const callback = (el, isInIframe) => {
      setter(el.offsetHeight - this._offsetHeight, isInIframe, this.getScreenHeight());
    };
    this.onAdapt(el, callback);
  }

  autoAdapt(dom, action) {
    this.autoAdaptDim(dom, (size, isInIframe, screenHeight) => {
      action(size, screenHeight, isInIframe);
    });
  }

  dispose() {
    this._watchers = [];
    window.removeEventListener('resize', this._adapter);
  }
}
