"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleLayer = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SimpleLayer =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(SimpleLayer, _React$PureComponent);

  function SimpleLayer() {
    _classCallCheck(this, SimpleLayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(SimpleLayer).apply(this, arguments));
  }

  _createClass(SimpleLayer, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          components = _this$props.components,
          LayerItem = _this$props.LayerItem,
          LayerGrid = _this$props.LayerGrid,
          style = _this$props.style;
      return _react["default"].createElement(LayerGrid, {
        className: "hc-layer hc-layer-simple",
        style: style
      }, components.map(function (item, index) {
        return _react["default"].createElement(LayerItem, _extends({
          key: item.key || index
        }, item.attrs, {
          className: "hc-layer-elem_box"
        }), item && item.component ? _react["default"].createElement(item.component, null) : null);
      }));
    }
  }]);

  return SimpleLayer;
}(_react["default"].PureComponent);

exports.SimpleLayer = SimpleLayer;
SimpleLayer.propTypes = {
  components: _propTypes["default"].array,
  LayerItem: _propTypes["default"].any,
  LayerGrid: _propTypes["default"].any,
  style: _propTypes["default"].object
};