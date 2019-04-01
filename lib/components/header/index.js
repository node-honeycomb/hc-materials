"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Header = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _layout = _interopRequireDefault(require("antd/lib/layout"));

var _icon = _interopRequireDefault(require("antd/lib/icon"));

var _dropdown = _interopRequireDefault(require("antd/lib/dropdown"));

var _spin = _interopRequireDefault(require("antd/lib/spin"));

var _menu = _interopRequireDefault(require("antd/lib/menu"));

var _avatar = _interopRequireDefault(require("antd/lib/avatar"));

var _search = require("../search");

var _sider = require("../sider");

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

var __metadata = void 0 && (void 0).__metadata || function (k, v) {
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

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
          _this._inputRef.current.focus();
        }
      });
    };

    _this.leaveSearchMode = function () {
      _this.setState({
        searchMode: false
      });
    };

    _this._inputRef = _react["default"].createRef();
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
          loading = _this$props.loading,
          className = _this$props.className,
          hasSetting = _this$props.hasSetting,
          search = _this$props.search,
          style = _this$props.style,
          collapsed = _this$props.collapsed,
          nick = _this$props.nick,
          noSider = _this$props.noSider,
          avatar = _this$props.avatar,
          theme = _this$props.theme,
          searchProps = _this$props.searchProps,
          menuProps = _this$props.menuProps,
          dropdownProps = _this$props.dropdownProps;
      searchProps.inputProps = _extends(searchProps.inputProps || {}, {
        ref: this._inputRef,
        onBlur: this.leaveSearchMode
      });
      return _react["default"].createElement(_layout["default"].Header, {
        className: 'hc-header ' + className + (theme ? ' hc-header-' + theme : ''),
        style: style
      }, loading, noSider ? null : _react["default"].createElement(_icon["default"], {
        className: "hc-header-trigger",
        type: collapsed ? 'menu-unfold' : 'menu-fold',
        onClick: this.toggleClick
      }), _react["default"].createElement("div", {
        className: "hc-header-right",
        style: {
          display: nick === false ? 'none' : ''
        }
      }, search !== undefined ? search : _react["default"].createElement("span", {
        className: 'hc-header-search ' + (this.state.searchMode ? 'hc-header-search-show' : ''),
        onClick: this.enterSearchMode
      }, _react["default"].createElement(_search.Search, _extends({
        placeholder: this.getLocale('searchPlaceholder'),
        onSelect: function onSelect(v) {
          return _this2.handleChange({
            value: v,
            key: 'search'
          });
        }
      }, searchProps))), nick ? _react["default"].createElement(_dropdown["default"], {
        overlay: _react["default"].createElement(_menu["default"], _extends({
          className: "hc-header-menu",
          selectedKeys: [],
          onClick: this.handleChange
        }, dropdownProps), _react["default"].createElement(_menu["default"].Item, {
          key: "profile"
        }, _react["default"].createElement(_icon["default"], {
          type: "user"
        }), this.getLocale('profile')), hasSetting ? _react["default"].createElement(_menu["default"].Item, {
          key: "setting"
        }, _react["default"].createElement(_icon["default"], {
          type: "setting"
        }), this.getLocale('setting')) : null, _react["default"].createElement(_menu["default"].Divider, null), _react["default"].createElement(_menu["default"].Item, {
          key: "logout"
        }, _react["default"].createElement(_icon["default"], {
          type: "logout"
        }), this.getLocale('logout')))
      }, _react["default"].createElement("span", {
        className: "hc-header-account"
      }, avatar && _react["default"].createElement(_avatar["default"], {
        size: "small",
        className: "hc-header-avatar",
        src: avatar
      }), " ", nick)) : _react["default"].createElement(_spin["default"], {
        size: "small",
        style: {
          marginLeft: 8
        }
      })), menuProps ? _react["default"].createElement(_sider.Sider, menuProps) : null);
    }
  }]);

  return Header;
}(_react["default"].PureComponent);

exports.Header = Header;
Header.propTypes = {
  className: _propTypes["default"].string,
  style: _propTypes["default"].object,
  brand: _propTypes["default"].object,
  collapsed: _propTypes["default"].bool,
  onCollapse: _propTypes["default"].func,
  avatar: _propTypes["default"].string,
  nick: _propTypes["default"].string,
  noSider: _propTypes["default"].bool,
  loading: _propTypes["default"].element,
  theme: _propTypes["default"].string,
  onChange: _propTypes["default"].func,
  hasSetting: _propTypes["default"].bool,
  search: _propTypes["default"].any,
  menuProps: _propTypes["default"].object,
  dropdownProps: _propTypes["default"].object,
  searchProps: _propTypes["default"].object
};
Header.defaultProps = {
  className: '',
  dropdownProps: {},
  searchProps: {}
};
exports.Header = Header = __decorate([(0, _localeContext.localeContext)('Header'), __metadata("design:paramtypes", [Object])], Header);