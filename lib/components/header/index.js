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

var __metadata = void 0 && (void 0).__metadata || function (k, v) {
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var prop_types_1 = require("prop-types");

var layout_1 = require("antd/lib/layout");

var icon_1 = require("antd/lib/icon");

var dropdown_1 = require("antd/lib/dropdown");

var spin_1 = require("antd/lib/spin");

var menu_1 = require("antd/lib/menu");

var avatar_1 = require("antd/lib/avatar");

var search_1 = require("../search");

var sider_1 = require("../sider");

var localeContext_1 = require("../../core/localeContext");

var Header =
/** @class */
function (_super) {
  __extends(Header, _super);

  function Header(props) {
    var _this = _super.call(this, props) || this;

    _this.toggleClick = function () {
      _this.props.onCollapse(!_this.props.collapsed);

      _this._resizeTimer = setTimeout(function () {
        var event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        window.dispatchEvent(event);
      }, 600);
    };

    _this.handleChange = function (e) {
      _this.props.onChange && _this.props.onChange(e);
    };

    _this.enterSearchMode = function () {
      _this.setState({
        searchMode: true
      }, function () {
        if (_this.state.searchMode) {
          _this._inputRef.current.focus();
        }
      });
    };

    _this.leaveSearchMode = function () {
      _this.setState({
        searchMode: false
      });
    };

    _this._inputRef = react_1["default"].createRef();
    _this.state = {
      searchMode: false
    };
    return _this;
  }

  Header.prototype.componentWillUnmount = function () {
    clearTimeout(this._resizeTimer);
  };

  Header.prototype.render = function () {
    var _this = this;

    var _a = this.props,
        loading = _a.loading,
        className = _a.className,
        hasSetting = _a.hasSetting,
        search = _a.search,
        style = _a.style,
        collapsed = _a.collapsed,
        nick = _a.nick,
        noSider = _a.noSider,
        avatar = _a.avatar,
        theme = _a.theme,
        searchProps = _a.searchProps,
        menuProps = _a.menuProps,
        dropdownProps = _a.dropdownProps;
    searchProps.inputProps = _extends(searchProps.inputProps || {}, {
      ref: this._inputRef,
      onBlur: this.leaveSearchMode
    });
    return React.createElement(layout_1["default"].Header, {
      className: 'hc-header ' + className + (theme ? ' hc-header-' + theme : ''),
      style: style
    }, loading, noSider ? null : React.createElement(icon_1["default"], {
      className: "hc-header-trigger",
      type: collapsed ? 'menu-unfold' : 'menu-fold',
      onClick: this.toggleClick
    }), React.createElement("div", {
      className: "hc-header-right",
      style: {
        display: nick === false ? 'none' : ''
      }
    }, search !== undefined ? search : React.createElement("span", {
      className: 'hc-header-search ' + (this.state.searchMode ? 'hc-header-search-show' : ''),
      onClick: this.enterSearchMode
    }, React.createElement(search_1.Search, _extends({
      placeholder: this.getLocale('searchPlaceholder'),
      onSelect: function onSelect(v) {
        return _this.handleChange({
          value: v,
          key: 'search'
        });
      }
    }, searchProps))), nick ? React.createElement(dropdown_1["default"], {
      overlay: React.createElement(menu_1["default"], _extends({
        className: "hc-header-menu",
        selectedKeys: [],
        onClick: this.handleChange
      }, dropdownProps), React.createElement(menu_1["default"].Item, {
        key: "profile"
      }, React.createElement(icon_1["default"], {
        type: "user"
      }), this.getLocale('profile')), hasSetting ? React.createElement(menu_1["default"].Item, {
        key: "setting"
      }, React.createElement(icon_1["default"], {
        type: "setting"
      }), this.getLocale('setting')) : null, React.createElement(menu_1["default"].Divider, null), React.createElement(menu_1["default"].Item, {
        key: "logout"
      }, React.createElement(icon_1["default"], {
        type: "logout"
      }), this.getLocale('logout')))
    }, React.createElement("span", {
      className: "hc-header-account"
    }, avatar && React.createElement(avatar_1["default"], {
      size: "small",
      className: "hc-header-avatar",
      src: avatar
    }), " ", nick)) : React.createElement(spin_1["default"], {
      size: "small",
      style: {
        marginLeft: 8
      }
    })), menuProps ? React.createElement(sider_1.Sider, menuProps) : null);
  };

  Header.propTypes = {
    className: prop_types_1["default"].string,
    style: prop_types_1["default"].object,
    brand: prop_types_1["default"].object,
    collapsed: prop_types_1["default"].bool,
    onCollapse: prop_types_1["default"].func,
    avatar: prop_types_1["default"].string,
    nick: prop_types_1["default"].string,
    noSider: prop_types_1["default"].bool,
    loading: prop_types_1["default"].element,
    theme: prop_types_1["default"].string,
    onChange: prop_types_1["default"].func,
    hasSetting: prop_types_1["default"].bool,
    search: prop_types_1["default"].any,
    menuProps: prop_types_1["default"].object,
    dropdownProps: prop_types_1["default"].object,
    searchProps: prop_types_1["default"].object
  };
  Header.defaultProps = {
    className: '',
    dropdownProps: {},
    searchProps: {}
  };
  Header = __decorate([localeContext_1.localeContext('Header'), __metadata("design:paramtypes", [Object])], Header);
  return Header;
}(react_1["default"].PureComponent);

exports.Header = Header;