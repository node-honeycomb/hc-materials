/**
 * @ali/kissy-cookie
 */
var doc = document;
var MILLISECONDS_OF_DAY = 24 * 60 * 60 * 1000;
var encode = encodeURIComponent;

function decode(s) {
  return decodeURIComponent(s.replace(/\+/g, ' '));
}

function isNotEmptyString(val) {
  return typeof val === 'string' && val !== '';
}
/**
 * Provide Cookie utilities.
 * @class Cookie
 * @singleton
 */


export var cookie = {
  /**
   * Returns the cookie value for given name
   * @return {String} name The name of the cookie to retrieve
   */
  get: function get(name) {
    var ret;
    var m;

    if (isNotEmptyString(name)) {
      if (m = String(doc.cookie).match(new RegExp('(?:^| )' + name + '(?:(?:=([^;]*))|;|$)'))) {
        ret = m[1] ? decode(m[1]) : '';
      }
    }

    return ret;
  },

  /**
   * Set a cookie with a given name and value
   * @param {String} name The name of the cookie to set
   * @param {String} val The value to set for cookie
   * @param {Number|Date} expires
   * if Number specified how many days this cookie will expire
   * @param {String} domain set cookie's domain
   * @param {String} path set cookie's path
   * @param {Boolean} secure whether this cookie can only be sent to server on https
   * @param {Boolean} raw encode val before set or not
   */
  set: function set(name, val, expires, domain, path, secure, raw) {
    var text;
    var date = expires; // 增加是否进行encode处理的判断

    if (!raw) {
      text = String(encode(val));
    } else {
      text = String(val);
    } // 从当前时间开始，多少天后过期


    if (typeof date === 'number') {
      date = new Date();
      date.setTime(date.getTime() + expires * MILLISECONDS_OF_DAY);
    } // expiration date


    if (date instanceof Date) {
      text += '; expires=' + date.toUTCString();
    } // domain


    if (isNotEmptyString(domain)) {
      text += '; domain=' + domain;
    } // path


    if (isNotEmptyString(path)) {
      text += '; path=' + path;
    } // secure


    if (secure) {
      text += '; secure';
    }

    doc.cookie = name + '=' + text;
  },

  /**
   * Remove a cookie from the machine by setting its expiration date to sometime in the past
   * @param {String} name The name of the cookie to remove.
   * @param {String} domain The cookie's domain
   * @param {String} path The cookie's path
   * @param {String} secure The cookie's secure option
   */
  remove: function remove(name, domain, path, secure) {
    this.set(name, '', -1, domain, path, secure);
  }
};