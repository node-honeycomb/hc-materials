"use strict";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var prop_types_1 = require("prop-types");

var menu_1 = require("antd/lib/menu");

var button_1 = require("antd/lib/button");

var dropdown_1 = require("antd/lib/dropdown");

var icon_1 = require("antd/lib/icon");

var localeContext_1 = require("../../core/localeContext");

var NavLink =
/** @class */
function (_super) {
  __extends(NavLink, _super);

  function NavLink() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  NavLink.prototype.setAction = function (key, flag) {
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
  };

  NavLink.prototype.handleClick = function (e) {
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
  };

  NavLink.prototype.render = function () {
    var handleClick = this.handleClick.bind(this);
    var _a = this.props,
        links = _a.links,
        menus = _a.menus,
        data = _a.data,
        className = _a.className,
        style = _a.style;
    var menu = React.createElement(menu_1["default"], {
      onClick: function onClick(e) {
        return handleClick(e);
      },
      className: "hc-navLink-dropdown_link"
    }, menus.map(function (item, index) {
      var propsByState = item.getProps ? item.getProps(data) : {};
      return React.createElement(menu_1["default"].Item, _extends({
        key: item.key || index,
        disabled: item.disabled,
        loading: item.loading
      }, propsByState), React.createElement("a", null, item.render ? item.render() : item.name));
    }));
    return React.createElement("div", {
      className: 'hc-navLink ' + className,
      style: style
    }, links.map(function (item, index) {
      var propsByState = item.getProps ? item.getProps(data) : {};
      return React.createElement(button_1["default"], _extends({
        size: item.size ? item.size : 'small',
        type: item.type ? item.type : 'button',
        className: item.type ? '' : 'ant-btn-link',
        key: item.key || index,
        disabled: item.disabled,
        loading: item.loading,
        onClick: function onClick() {
          return handleClick(item);
        }
      }, propsByState), item.href ? React.createElement("a", {
        href: item.href,
        target: item.target || '_blank'
      }, item.render ? item.render() : item.name) : React.createElement("span", null, item.render ? item.render() : item.name));
    }), menus.length ? this.props.menuLabel ? React.createElement(dropdown_1["default"].Button, {
      overlay: menu
    }, this.props.menuLabel) : React.createElement(dropdown_1["default"], {
      overlay: menu
    }, React.createElement("a", {
      className: "ant-dropdown-link ant-btn-link"
    }, this.getLocale().more, React.createElement(icon_1["default"], {
      type: "down"
    }))) : null);
  };

  NavLink.propTypes = {
    className: prop_types_1["default"].string,
    style: prop_types_1["default"].object,
    links: prop_types_1["default"].array,
    menus: prop_types_1["default"].array,
    onClick: prop_types_1["default"].func,
    data: prop_types_1["default"].any,
    menuLabel: prop_types_1["default"].any
  };
  NavLink.defaultProps = {
    className: '',
    links: [],
    menus: []
  };
  NavLink = __decorate([localeContext_1.localeContext('NavLink')], NavLink);
  return NavLink;
}(react_1["default"].PureComponent);

exports.NavLink = NavLink;