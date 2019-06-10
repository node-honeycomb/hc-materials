"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HocCreator = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _dataSet = require("../../components/dataSet");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var HocCreator =
/*#__PURE__*/
function () {
  function HocCreator(context) {
    _classCallCheck(this, HocCreator);

    this.context = context;
    this._modals = [];
  }
  /**
   * modalOption = {
   *  // 对话框的配置
   *  modalProps,
   *  // 对话框打开类型
   *  modalType,
   *  // 独立打开
   *  standalone,
   *  // 子组件的属性
   *  childProps
   * }
   */


  _createClass(HocCreator, [{
    key: "getModalComponent",
    value: function getModalComponent(Widget, modalOption, richProps) {
      var modalType = modalOption.modalType || 'open'; // 有richProps说明是一个动态数据的组件

      if (richProps) {
        Widget = this.getRichComponent(Widget, richProps);
      }

      var option = _extends({
        content: _react["default"].createElement(Widget, modalOption.childProps)
      }, modalOption.modalProps);

      var modal = this.context.modaler[modalType](option); // 多个对话框可以叠加

      if (modalOption.standalone) {
        this._modals.push(modal);
      } else {
        // 否则把之前的对话框干掉，只显示当前的
        this._modals[0] && this._modals[0].destroy();
        this._modals[0] = modal;
      }

      return modal;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var modal = this._modals.pop();

      while (modal) {
        modal.destroy();
        modal = this._modals.pop();
      }
    }
  }, {
    key: "getRichComponent",
    value: function getRichComponent(Widget, richProps) {
      var RichWidget =
      /*#__PURE__*/
      function (_React$PureComponent) {
        _inherits(RichWidget, _React$PureComponent);

        function RichWidget() {
          var _this;

          _classCallCheck(this, RichWidget);

          _this = _possibleConstructorReturn(this, _getPrototypeOf(RichWidget).apply(this, arguments));
          _this._wrapRef = _react["default"].createRef();
          return _this;
        }

        _createClass(RichWidget, [{
          key: "getRealInstance",
          value: function getRealInstance() {
            return this._wrapRef.current;
          }
        }, {
          key: "handleResolve",
          value: function handleResolve(v, params) {
            this._wrapRef.current.handleResolve(v, params);
          }
        }, {
          key: "render",
          value: function render() {
            if (richProps.childProps) {
              _extends(richProps.childProps, this.props);
            } else {
              richProps.childProps = _extends({}, this.props);
            }

            return _react["default"].createElement(_dataSet.DataSet, _extends({
              ref: this._wrapRef
            }, richProps), _react["default"].createElement(Widget, null));
          }
        }]);

        return RichWidget;
      }(_react["default"].PureComponent);

      return RichWidget;
    }
  }]);

  return HocCreator;
}();

exports.HocCreator = HocCreator;
HocCreator.contextTypes = {
  modaler: _propTypes["default"].object.isRequired
};