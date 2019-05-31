"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Modaler = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _antd = require("antd");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
  }
  return t;
};

var Modaler =
/*#__PURE__*/
function () {
  function Modaler(context) {
    var _this = this;

    _classCallCheck(this, Modaler);

    this.context = context;
    this._modals = [];
    this._cfg = {
      width: 520,
      container: this.context.app.storeContainer
    };
    ['info', 'success', 'error', 'warning', 'confirm'].forEach(function (action) {
      _this[action] = function (dialogProps) {
        if (!dialogProps.getContainer) {
          dialogProps.getContainer = function () {
            return context.app.storeContainer;
          };
        }

        dialogProps.width = dialogProps.width || _this._cfg.width;

        var closeModal = _antd.Modal[action](dialogProps);

        _this._modals.push({
          destroy: closeModal
        });

        return _this._modals[_this._modals.length - 1];
      };
    });
    this.wrapperDiv = document.createElement('div');
    document.body.appendChild(this.wrapperDiv);
  }

  _createClass(Modaler, [{
    key: "set",
    value: function set(name, value) {
      if (Object(name) === name) {
        _extends(this._cfg, name);
      } else {
        this._cfg[name] = value;
      }
    }
  }, {
    key: "open",
    value: function open(_a) {
      var content = _a.content,
          dialogProps = __rest(_a, ["content"]);

      var context = this.context;

      var Dialog =
      /*#__PURE__*/
      function (_React$PureComponent) {
        _inherits(Dialog, _React$PureComponent);

        _createClass(Dialog, [{
          key: "getChildContext",
          value: function getChildContext() {
            return context;
          }
        }]);

        function Dialog(props) {
          var _this2;

          _classCallCheck(this, Dialog);

          _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Dialog).call(this, props));
          _this2.state = {
            visible: true,
            getContainer: function getContainer() {
              return _this2._cfg.container;
            },
            onOk: function onOk() {
              return _this2.trigger(dialogProps.onOk, _this2.setState.bind(_assertThisInitialized(_this2)));
            },
            onCancel: function onCancel() {
              return _this2.trigger(dialogProps.onCancel, _this2.setState.bind(_assertThisInitialized(_this2)));
            },
            width: dialogProps.width || _this2._cfg.width
          };

          _this2._modals.push({
            destroy: function destroy() {
              return _this2.setState({
                visible: false
              });
            }
          });

          return _this2;
        }

        _createClass(Dialog, [{
          key: "render",
          value: function render() {
            return _react["default"].createElement(_antd.Modal, _extends({}, dialogProps, this.state), content);
          }
        }]);

        return Dialog;
      }(_react["default"].PureComponent);

      _reactDom["default"].render(_react["default"].createElement(Dialog, null), this.wrapperDiv);

      return this._modals[this._modals.length - 1];
    }
  }, {
    key: "trigger",
    value: function trigger(actionFn, setState) {
      var closeModal = function closeModal() {
        return setState({
          visible: false
        });
      };

      if (actionFn) {
        var ret = actionFn(closeModal);

        if (ret && ret.then) {
          ret.then(function () {
            // It's unnecessary to set loading=false, for the Modal will be unmounted after
            setState({
              confirmLoading: true
            });
          }, function () {
            setState({
              confirmLoading: false
            });
          })["catch"](function () {
            setState({
              confirmLoading: false
            });
          });
        } else if (ret !== false) {
          closeModal();
        }
      } else {
        closeModal();
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      var modal = this._modals.pop();

      while (modal) {
        modal.destroy();
        modal = this._modals.pop();
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.clear();
    }
  }]);

  return Modaler;
}();

exports.Modaler = Modaler;
Modaler.propTypes = {
  app: _propTypes["default"].object.isRequired
};