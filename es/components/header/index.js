function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, Dropdown, Spin, Menu, Avatar } from 'antd';
import { Search } from '../search';
import { Sider } from '../sider';
import { localeContext } from '../../core/localeContext';
/* eslint-disable react/prop-types */

function Profile(_ref) {
  var nick = _ref.nick,
      hasSetting = _ref.hasSetting,
      avatar = _ref.avatar,
      dropdownProps = _ref.dropdownProps,
      onClick = _ref.onClick,
      msgs = _ref.msgs;
  return nick ? React.createElement(Dropdown, {
    overlay: React.createElement(Menu, _extends({
      className: "hc-header-menu",
      selectedKeys: [],
      onClick: onClick
    }, dropdownProps), React.createElement(Menu.Item, {
      key: "profile"
    }, React.createElement(Icon, {
      type: "user"
    }), msgs.profile), hasSetting ? React.createElement(Menu.Item, {
      key: "setting"
    }, React.createElement(Icon, {
      type: "setting"
    }), msgs.setting) : null, React.createElement(Menu.Divider, null), React.createElement(Menu.Item, {
      key: "logout"
    }, React.createElement(Icon, {
      type: "logout"
    }), msgs.logout))
  }, React.createElement("span", {
    className: "hc-header-account"
  }, avatar && React.createElement(Avatar, {
    size: "small",
    className: "hc-header-avatar",
    src: avatar
  }), " ", nick)) : React.createElement(Spin, {
    size: "small",
    style: {
      marginLeft: 8
    }
  });
}

var Header =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(Header, _React$PureComponent);

  function Header(props) {
    var _this;

    _classCallCheck(this, Header);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Header).call(this, props));

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
          _this._inputRef.current && _this._inputRef.current.focus();
        }
      });
    };

    _this.leaveSearchMode = function () {
      _this.setState({
        searchMode: false
      });
    };

    _this._inputRef = React.createRef();
    _this.state = {
      searchMode: false
    };
    return _this;
  }

  _createClass(Header, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearTimeout(this._resizeTimer);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          project = _this$props.project,
          className = _this$props.className,
          search = _this$props.search,
          style = _this$props.style,
          collapsed = _this$props.collapsed,
          noSider = _this$props.noSider,
          theme = _this$props.theme,
          searchProps = _this$props.searchProps,
          menuProps = _this$props.menuProps,
          profile = _this$props.profile,
          profileProps = _this$props.profileProps;
      searchProps.inputProps = _extends(searchProps.inputProps || {}, {
        ref: this._inputRef,
        onBlur: this.leaveSearchMode
      });
      return React.createElement(Layout.Header, {
        className: 'hc-header ' + className + (theme ? ' hc-header-' + theme : ''),
        style: style
      }, project, noSider ? null : React.createElement(Icon, {
        className: "hc-header-trigger",
        type: collapsed ? 'menu-unfold' : 'menu-fold',
        onClick: this.toggleClick
      }), React.createElement("div", {
        className: "hc-header-right",
        style: {
          display: profileProps.nick === false ? 'none' : ''
        }
      }, search !== undefined ? search : React.createElement("span", {
        className: 'hc-header-search ' + (this.state.searchMode ? 'hc-header-search-show' : ''),
        onClick: this.enterSearchMode
      }, React.createElement(Search, _extends({
        placeholder: this.getLocale('searchPlaceholder'),
        onSelect: function onSelect(v) {
          return _this2.handleChange({
            value: v,
            key: 'search'
          });
        }
      }, searchProps))), profile || React.createElement(Profile, _extends({}, profileProps, {
        onClick: this.handleChange,
        msgs: this.getLocale()
      }))), menuProps ? React.createElement(Sider, menuProps) : null);
    }
  }]);

  return Header;
}(React.PureComponent);

Header.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  collapsed: PropTypes.bool,
  onCollapse: PropTypes.func,
  noSider: PropTypes.bool,
  project: PropTypes.any,
  theme: PropTypes.string,
  onChange: PropTypes.func,
  search: PropTypes.any,
  menuProps: PropTypes.object,
  profile: PropTypes.any,
  profileProps: PropTypes.object,
  searchProps: PropTypes.object
};
Header.defaultProps = {
  className: '',
  profileProps: {},
  searchProps: {}
};
Header = __decorate([localeContext('Header', {
  searchPlaceholder: '输入关键字进行搜索',
  profile: '个人信息',
  setting: '设置',
  logout: '登出'
}), __metadata("design:paramtypes", [Object])], Header);
export { Header };