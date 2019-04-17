"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Modaler = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _modal = _interopRequireDefault(require("antd/lib/modal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
      width: null,
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

        var closeModal = _modal["default"][action](dialogProps);

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
      this._cfg[name] = value;
    }
  }, {
    key: "open",
    value: function open(_a) {
      var _this2 = this;

      var content = _a.content,
          dialogProps = __rest(_a, ["content"]);

      var Dialog = function Dialog() {
        var _useState = (0, _react.useState)({
          visible: true,
          getContainer: function getContainer() {
            return _this2._cfg.container;
          },
          onOk: function onOk() {
            return _this2.trigger(dialogProps.onOk, setState);
          },
          onCancel: function onCancel() {
            return _this2.trigger(dialogProps.onCancel, setState);
          },
          width: dialogProps.width || _this2._cfg.width
        }),
            _useState2 = _slicedToArray(_useState, 2),
            state = _useState2[0],
            setState = _useState2[1];

        _this2._modals.push({
          destroy: function destroy() {
            return setState({
              visible: false
            });
          }
        });

        return _react["default"].createElement(_modal["default"], _extends({}, dialogProps, state), content);
      };

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