// see: https://www.npmjs.com/package/vue-resize
export class Resizer {
  get isIE() {
    if (this._isIE === undefined) {
      const ua = window.navigator.userAgent;

      const msie = ua.indexOf('MSIE ');
      if (msie > 0) {
        // IE 10 or older => return version number
        this._isIE = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
      }

      const trident = ua.indexOf('Trident/');
      if (trident > 0) {
        // IE 11 => return version number
        const rv = ua.indexOf('rv:');
        this._isIE = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
      }

      const edge = ua.indexOf('Edge/');
      if (edge > 0) {
        // Edge (IE 12+) => return version number
        this._isIE = parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
      }

      // other browser
      this._isIE = -1;
    }
    return this._isIE;
  }

  resize(el, callback) {
    const object = document.createElement('object');
    this._resizeObject = object;
    object.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
    object.setAttribute('aria-hidden', 'true');
    object.setAttribute('tabindex', -1);
    object.onload = () => {
      object.contentDocument.defaultView.addEventListener('resize', callback);
    };
    object.type = 'text/html';
    if (this.isIE) {
      el.appendChild(object);
    }
    object.data = 'about:blank';
    if (!this.isIE) {
      el.appendChild(object);
    }
    return () => {
      object.contentDocument.defaultView.removeEventListener('resize', callback);
    };
  }
}
