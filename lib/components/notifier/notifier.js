"use strict";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var message_1 = require("antd/lib/message");

var notification_1 = require("antd/lib/notification");

var copyLogger_1 = require("./copyLogger"); // 默认8秒


notification_1["default"].config({
  duration: 8
}); // 默认4秒

message_1["default"].config({
  duration: 4
});

var seniorNotification = _extends({}, notification_1["default"]);

['success', 'info', 'warning', 'error', 'warn'].forEach(function (type) {
  seniorNotification[type] = function (args) {
    return notification_1["default"][type](_extends({}, args, {
      type: type,
      duration: null
    }));
  };
});

var Notifier =
/** @class */
function () {
  function Notifier(opt, immediate) {
    if (opt === void 0) {
      opt = {};
    }

    this.$opt_ = opt;

    if (immediate) {
      this.notify(opt);
    }
  }

  Notifier.prototype.notify = function (opt) {
    var _this = this;

    var strategy = Notifier.strategy; // 特殊处理

    if (opt.rid) {
      opt = {
        content: opt
      };
    }

    opt = _extends({
      type: 'info',
      level: 'one'
    }, this.$opt_, opt);

    if (opt.trace) {
      delete this.$opt_.trace;
      delete opt.trace;

      if (opt.content.then) {
        opt.content.then(function (res) {
          if (Object(res) !== res) {
            res = {
              message: res
            };
          }

          var rid = opt.rid || res.rid;

          if (rid) {
            opt.content = React.createElement("div", null, React.createElement("span", null, res.message), React.createElement(copyLogger_1.CopyLogger, {
              rid: rid,
              message: 'rid: ' + rid
            }));
          } else {
            opt.content = res.message;
          }

          _this.notify(opt);
        }, function (err) {
          opt.content = err.message;

          _this.notify(opt);
        });
      } else {
        if (Object(opt.content) === opt.content) {
          var rid = opt.rid || opt.content.rid;
          var content = opt.content.message;

          if (rid) {
            opt.content = React.createElement("div", null, React.createElement("span", null, content), React.createElement(copyLogger_1.CopyLogger, {
              rid: rid,
              message: 'rid: ' + rid
            }));
          } else {
            opt.content = content;
          }
        }

        this.notify(opt);
      }
    } else {
      // notification 和 message的初始化方式不同
      if (strategy[opt.level] === notification_1["default"]) {
        strategy[opt.level][opt.type]({
          message: opt.title || '提示',
          description: opt.content,
          btn: opt.btn,
          icon: opt.icon,
          key: opt.key,
          onClose: opt.onClose,
          duration: opt.duration
        });
      } else {
        strategy[opt.level][opt.type](opt.content, opt.duration);
      }
    }
  };

  Notifier.notifierFactory = function (type, title, content) {
    return new Notifier({
      level: 'two',
      type: type,
      title: title || '错误异常',
      content: content,
      trace: true
    });
  };

  Notifier.error = function (title, content) {
    if (content) {
      return new Notifier({
        type: 'error',
        level: 'two',
        title: title,
        content: content
      }, 1);
    } else {
      return new Notifier({
        type: 'error',
        level: 'one',
        content: title
      }, 1);
    }
  };

  Notifier.success = function (title, content) {
    if (content) {
      return new Notifier({
        type: 'success',
        level: 'two',
        title: title,
        content: content
      }, 1);
    } else {
      return new Notifier({
        type: 'success',
        level: 'one',
        content: title
      }, 1);
    }
  };

  Notifier.info = function (title, content) {
    if (content) {
      return new Notifier({
        type: 'info',
        level: 'two',
        title: title,
        content: content
      }, 1);
    } else {
      return new Notifier({
        type: 'info',
        level: 'one',
        content: title
      }, 1);
    }
  };

  Notifier.warn = function (title, content) {
    if (content) {
      return new Notifier({
        type: 'warn',
        level: 'two',
        title: title,
        content: content
      }, 1);
    } else {
      return new Notifier({
        type: 'warn',
        level: 'one',
        content: title
      }, 1);
    }
  };

  Notifier.strategy = {
    one: message_1["default"],
    two: notification_1["default"],
    three: seniorNotification
  };
  return Notifier;
}();

exports.Notifier = Notifier;