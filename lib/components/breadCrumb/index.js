"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BreadCrumb = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRouter = require("react-router");

var _breadcrumb = _interopRequireDefault(require("antd/lib/breadcrumb"));

var _navLink = require("../navLink");

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

var BreadCrumb =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(BreadCrumb, _React$PureComponent);

  function BreadCrumb() {
    _classCallCheck(this, BreadCrumb);

    return _possibleConstructorReturn(this, _getPrototypeOf(BreadCrumb).apply(this, arguments));
  }

  _createClass(BreadCrumb, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          style = _this$props.style,
          navs = _this$props.navs,
          links = _this$props.links,
          extra = _this$props.extra;
      return _react["default"].createElement("div", {
        className: 'hc-breadcrumb ' + className,
        style: style
      }, _react["default"].createElement(_breadcrumb["default"], null, navs.map(function (item, index) {
        if (item.link) {
          return _react["default"].createElement(_breadcrumb["default"].Item, {
            key: index
          }, _react["default"].createElement(_reactRouter.Link, {
            to: item.link
          }, item.text));
        } else {
          return _react["default"].createElement(_breadcrumb["default"].Item, {
            key: index
          }, item.text);
        }
      }), links || extra ? _react["default"].createElement(_breadcrumb["default"].Item, {
        className: "hc-breadcrumb-extra"
      }, links && _react["default"].createElement(_navLink.NavLink, {
        links: links
      }), extra) : null), this.props.combox);
    }
  }]);

  return BreadCrumb;
}(_react["default"].PureComponent);

exports.BreadCrumb = BreadCrumb;

BreadCrumb.parse = function (route, subRoutes) {
  var navs = [];

  if (route) {
    navs.push({
      text: route.title
    });

    if (route.navKey && subRoutes[route.navKey]) {
      navs.unshift({
        text: subRoutes[route.navKey].title || route.navKey
      });
    }

    while ((route = route.parent) && route.title) {
      navs.unshift({
        link: route.resolvePath,
        text: route.title
      });
    }
  }

  return navs;
};

BreadCrumb.propTypes = {
  className: _propTypes["default"].string,
  style: _propTypes["default"].object,
  combox: _propTypes["default"].element,
  navs: _propTypes["default"].array,
  links: _propTypes["default"].array,
  extra: _propTypes["default"].any
};
BreadCrumb.defaultProps = {
  className: '',
  navs: []
};