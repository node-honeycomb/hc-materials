var ua = navigator.userAgent.toLowerCase();
var isIE = (ua.indexOf('msie') > -1);
var userDataEl;
var d = document;

var tp = location
  .pathname
  .split('/');
tp[tp.length - 1] = '';
var path = encodeURIComponent(tp.join('/'));

var ls;
var newLocalStorage;
try {
  ls = window.localStorage;
} catch (e) {
  window.console.warn(e);
}
if (ls) {
  userDataEl = window.localStorage;
  newLocalStorage = {
    set: function (k, v) {
      try {
        userDataEl.setItem(k, v);
      } catch (e) {
        return false;
      }
      return true;
    },
    get: function (k) {
      try {
        return userDataEl.getItem(k);
      } catch (e) {
        return;
      }
    }
  };
} else if (isIE) {
  userDataEl = d.getElementById('_console_userdata');
  if (!userDataEl) {
    userDataEl = d.createElement('input');
    userDataEl.type = 'hidden';
    d
      .body
      .insertBefore(userDataEl, d.body.firstChild);

    try {
      userDataEl.addBehavior('#default#userData');
    } catch (e) {
      window.console.warn(e);
    }
  }

  newLocalStorage = {
    set: function (k, v) {
      try {
        userDataEl.load(path);
        userDataEl.setAttribute(k, v);
        userDataEl.save(path);
      } catch (e) {
        return false;
      }
      return true;
    },
    get: function (k) {
      try {
        userDataEl.load(path);
      } catch (e) {
        return;
      }
      return userDataEl.getAttribute(k);
    }
  };
} else {
  newLocalStorage = {
    set: function () {},
    get: function () {}
  };
}

export const localStorage = newLocalStorage;
