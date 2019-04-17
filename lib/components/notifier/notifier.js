"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Notifier = void 0;

var _react = _interopRequireDefault(require("react"));

var _message = _interopRequireDefault(require("antd/lib/message"));

var _notification = _interopRequireDefault(require("antd/lib/notification"));

var _copyLogger = require("./copyLogger");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// 默认8秒
_notification["default"].config({
  duration: 8
}); // 默认4秒


_message["default"].config({
  duration: 4
});

var seniorNotification = _extends({}, _notification["default"]);

['success', 'info', 'warning', 'error', 'warn'].forEach(function (type) {
  seniorNotification[type] = function (args) {
    return _notification["default"][type](_extends({}, args, {
      type: type,
      duration: null
    }));
  };
});

var Notifier =
/*#__PURE__*/
function () {
  function Notifier() {
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var immediate = arguments.length > 1 ? arguments[1] : undefined;

    _classCallCheck(this, Notifier);

    this.$opt_ = opt;

    if (immediate) {
      this.notify(opt);
    }
  }

  _createClass(Notifier, [{
    key: "notify",
    value: function notify(opt) {
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
              opt.content = _react["default"].createElement("div", null, _react["default"].createElement("span", null, res.message), _react["default"].createElement(_copyLogger.CopyLogger, {
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
              opt.content = _react["default"].createElement("div", null, _react["default"].createElement("span", null, content), _react["default"].createElement(_copyLogger.CopyLogger, {
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
        if (strategy[opt.level] === _notification["default"]) {
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
    }
  }], [{
    key: "notifierFactory",
    value: function notifierFactory(type, title, content) {
      return new Notifier({
        level: 'two',
        type: type,
        title: title || '错误异常',
        content: content,
        trace: true
      });
    }
  }, {
    key: "error",
    value: function error(title, content) {
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
    }
  }, {
    key: "success",
    value: function success(title, content) {
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
    }
  }, {
    key: "info",
    value: function info(title, content) {
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
    }
  }, {
    key: "warn",
    value: function warn(title, content) {
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
    }
  }]);

  return Notifier;
}();

exports.Notifier = Notifier;
Notifier.strategy = {
  one: _message["default"],
  two: _notification["default"],
  three: seniorNotification
};