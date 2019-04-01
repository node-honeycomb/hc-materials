"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NavLink = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _menu = _interopRequireDefault(require("antd/lib/menu"));

var _button = _interopRequireDefault(require("antd/lib/button"));

var _dropdown = _interopRequireDefault(require("antd/lib/dropdown"));

var _icon = _interopRequireDefault(require("antd/lib/icon"));

var _localeContext = require("../../core/localeContext");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var NavLink =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(NavLink, _React$PureComponent);

  function NavLink() {
    _classCallCheck(this, NavLink);

    return _possibleConstructorReturn(this, _getPrototypeOf(NavLink).apply(this, arguments));
  }

  _createClass(NavLink, [{
    key: "setAction",
    value: function setAction(key, flag) {
      var item;

      if (Object(key) === key) {
        item = key;
      } else {
        item = this.props.links.find(function (item) {
          return item.key === key;
        }) || this.props.menus.find(function (item) {
          return item.key === key;
        });
      }

      if (item.propName) {
        item[item.propName] = flag;
      }

      this.forceUpdate();
      return item;
    }
  }, {
    key: "handleClick",
    value: function handleClick(e) {
      var _this = this;

      var key = e.key;
      var item = this.setAction(key, true);
      var action = item.action || this.props.onClick;

      var cancelCallback = function cancelCallback() {
        _this.setAction(item, false);
      };

      if (action) {
        if (!action(e, this.props.data, cancelCallback)) {
          cancelCallback();
        }
      } else {
        cancelCallback();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var handleClick = this.handleClick.bind(this);
      var _this$props = this.props,
          links = _this$props.links,
          menus = _this$props.menus,
          data = _this$props.data,
          className = _this$props.className,
          style = _this$props.style;

      var menu = _react["default"].createElement(_menu["default"], {
        onClick: function onClick(e) {
          return handleClick(e);
        },
        className: "hc-navLink-dropdown_link"
      }, menus.map(function (item, index) {
        var propsByState = item.getProps ? item.getProps(data) : {};
        return _react["default"].createElement(_menu["default"].Item, _extends({
          key: item.key || index,
          disabled: item.disabled,
          loading: item.loading
        }, propsByState), _react["default"].createElement("a", null, item.render ? item.render() : item.name));
      }));

      return _react["default"].createElement("div", {
        className: 'hc-navLink ' + className,
        style: style
      }, links.map(function (item, index) {
        var propsByState = item.getProps ? item.getProps(data) : {};
        return _react["default"].createElement(_button["default"], _extends({
          size: item.size ? item.size : 'small',
          type: item.type ? item.type : 'button',
          className: item.type ? '' : 'ant-btn-link',
          key: item.key || index,
          disabled: item.disabled,
          loading: item.loading,
          onClick: function onClick() {
            return handleClick(item);
          }
        }, propsByState), item.href ? _react["default"].createElement("a", {
          href: item.href,
          target: item.target || '_blank'
        }, item.render ? item.render() : item.name) : _react["default"].createElement("span", null, item.render ? item.render() : item.name));
      }), menus.length ? this.props.menuLabel ? _react["default"].createElement(_dropdown["default"].Button, {
        overlay: menu
      }, this.props.menuLabel) : _react["default"].createElement(_dropdown["default"], {
        overlay: menu
      }, _react["default"].createElement("a", {
        className: "ant-dropdown-link ant-btn-link"
      }, this.getLocale().more, _react["default"].createElement(_icon["default"], {
        type: "down"
      }))) : null);
    }
  }]);

  return NavLink;
}(_react["default"].PureComponent);

exports.NavLink = NavLink;
NavLink.propTypes = {
  className: _propTypes["default"].string,
  style: _propTypes["default"].object,
  links: _propTypes["default"].array,
  menus: _propTypes["default"].array,
  onClick: _propTypes["default"].func,
  data: _propTypes["default"].any,
  menuLabel: _propTypes["default"].any
};
NavLink.defaultProps = {
  className: '',
  links: [],
  menus: []
};
exports.NavLink = NavLink = __decorate([(0, _localeContext.localeContext)('NavLink')], NavLink);