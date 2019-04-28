"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConsoleLayout = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _antd = require("antd");

var _sider = require("../../components/sider");

var _header = require("../../components/header");

var _localStorage = require("../../core/localStorage");

var _basicLayout = require("../basicLayout");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var COLLAPSED_KEY = 'beatle_console_sidebar';

var ConsoleLayout =
/*#__PURE__*/
function (_BasicLayout) {
  _inherits(ConsoleLayout, _BasicLayout);

  function ConsoleLayout(props) {
    var _this;

    _classCallCheck(this, ConsoleLayout);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ConsoleLayout).call(this, props));
    _this.state = {
      inited: true,
      collapsed: _localStorage.localStorage.get(COLLAPSED_KEY) === 'true' || false
    };
    return _this;
  }

  _createClass(ConsoleLayout, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var collapseCfg = {
        collapsed: this.state.collapsed,
        onCollapse: function onCollapse(collapsed) {
          // if (this.state.inited && this.state.collapsed) {
          //   this.setState({inited: false});
          //   return;
          // }
          _this2.setState({
            collapsed: collapsed,
            inited: false
          });

          _localStorage.localStorage.set(COLLAPSED_KEY, collapsed);
        }
      };
      var Sider = this.getComponent('Sider');
      var Header = this.getComponent('Header');
      return _react["default"].createElement("div", {
        className: 'hc-layout-console ' + this.props.className,
        style: this.props.style
      }, _react["default"].createElement(_antd.Layout, {
        className: "hc-layout-console_has-sider"
      }, _react["default"].createElement(Sider, collapseCfg), _react["default"].createElement(_antd.Layout, null, _react["default"].createElement(Header, collapseCfg), _react["default"].createElement(_antd.Layout.Content, {
        className: "hc-layout-console-body"
      }, this.props.viewContent || this.props.children))));
    }
  }]);

  return ConsoleLayout;
}(_basicLayout.BasicLayout);

exports.ConsoleLayout = ConsoleLayout;
ConsoleLayout.layoutBlocks = {
  Header: _header.Header,
  Sider: _sider.Sider
};
ConsoleLayout.propTypes = {
  className: _propTypes["default"].string,
  style: _propTypes["default"].object
};
ConsoleLayout.defaultProps = {
  className: ''
};