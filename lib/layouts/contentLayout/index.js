"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContentLayout = void 0;

var _react = _interopRequireDefault(require("react"));

var _antd = require("antd");

var _footer = require("../../components/footer");

var _breadCrumb = require("../../components/breadCrumb");

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

var ContentLayout =
/*#__PURE__*/
function (_BasicLayout) {
  _inherits(ContentLayout, _BasicLayout);

  function ContentLayout() {
    _classCallCheck(this, ContentLayout);

    return _possibleConstructorReturn(this, _getPrototypeOf(ContentLayout).apply(this, arguments));
  }

  _createClass(ContentLayout, [{
    key: "render",
    value: function render() {
      var Footer = this.getComponent('Footer');
      var BreadCrumb = this.getComponent('BreadCrumb');
      return _react["default"].createElement("div", {
        className: 'hc-layout-content ' + this.props.className,
        style: this.props.style
      }, _react["default"].createElement(BreadCrumb, {
        className: "hc-layout-content-breadCrumb"
      }), _react["default"].createElement("div", {
        className: "hc-layout-content-body"
      }, _react["default"].createElement(_antd.Card, {
        bordered: false
      }, this.props.viewContent || this.props.children)), _react["default"].createElement(Footer, {
        className: "hc-layout-content-footer"
      }));
    }
  }]);

  return ContentLayout;
}(_basicLayout.BasicLayout);

exports.ContentLayout = ContentLayout;
ContentLayout.layoutBlocks = {
  Footer: _footer.Footer,
  BreadCrumb: _breadCrumb.BreadCrumb
};