"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FlexContentLayout = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _antd = require("antd");

var _breadCrumb = require("../../components/breadCrumb");

var _footer = require("../../components/footer");

var _basicLayout = require("../basicLayout");

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

var styles = {
  root: {
    flexGrow: 1
  },
  appFrame: {
    minHeight: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%'
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: 'none'
  },
  drawerPaper: {
    position: 'relative'
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px'
  },
  drawerHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px'
  },
  content: {
    flexGrow: 1,
    padding: 0
  },
  'contentShift-left': {
    marginLeft: 0
  },
  'contentShift-right': {
    marginRight: 0
  },
  iconSelected: {
    color: '#00bfdc',
    background: '#e6f7ff',
    boxShadow: '-1px -1px 1px #c5dff5'
  },
  title: {
    height: 30,
    width: '100%',
    lineHeight: '30px',
    paddingLeft: '10px',
    whiteSpace: 'nowrap',
    wordBreak: 'break-all',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  }
};

var FlexContentLayout =
/*#__PURE__*/
function (_BasicLayout) {
  _inherits(FlexContentLayout, _BasicLayout);

  function FlexContentLayout(props) {
    var _this;

    _classCallCheck(this, FlexContentLayout);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FlexContentLayout).call(this, props));

    _this.handleLeftDrawer = function (open) {
      if (open === false) {
        _this.setState({
          openLeft: false
        });
      } else {
        _this.setState({
          openLeft: !_this.state.openLeft
        }); // openProcessor: false

      }
    };

    _this.handleRightDrawer = function (open) {
      if (open === false) {
        _this.setState({
          openRight: false
        });
      } else {
        _this.setState({
          openRight: !_this.state.openRight
        });
      }
    };

    _this.handleRightDrawerClose = function () {
      _this.setState({
        openRight: false
      });
    };

    var drawerStyle = _extends({
      zIndex: _this.props.zIndex || 1000,
      position: 'absolute'
    }, props.drawerStyle);

    _this.state = {
      openLeft: !!_this.props.openLeft,
      openRight: !!_this.props.openRight,
      drawerStyle: drawerStyle
    };
    _this._beforeDrawer = _react["default"].createRef();
    _this._afterDrawer = _react["default"].createRef();
    return _this;
  }

  _createClass(FlexContentLayout, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var Footer = this.getComponent('Footer');
      var BreadCrumb = this.getComponent('BreadCrumb');
      var LeftDrawer = this.getComponent('LeftDrawer');
      var RightDrawer = this.getComponent('RightDrawer');
      var Overview = this.getComponent('Overview');
      var Combox = this.getComponent('Combox');
      var _this$props = this.props,
          className = _this$props.className,
          drawerWidth = _this$props.drawerWidth,
          contentStyle = _this$props.contentStyle,
          overviewWidth = _this$props.overviewWidth,
          leftTitle = _this$props.leftTitle,
          rightTitle = _this$props.rightTitle,
          affix = _this$props.affix,
          style = _this$props.style,
          mainStyle = _this$props.mainStyle;
      var _this$state = this.state,
          drawerStyle = _this$state.drawerStyle,
          openLeft = _this$state.openLeft,
          openRight = _this$state.openRight;
      var hasOverview = this.hasComponent('Overview');
      var hasLeftDrawer = this.hasComponent('LeftDrawer');
      var hasRightDrawer = this.hasComponent('RightDrawer');
      var StepConnector = this.getComponent('StepConnector');
      var hasStepConnector = this.hasComponent('StepConnector');
      contentStyle.minHeight = this.hasComponent('Footer') ? 'calc(100% - 142px)' : 'calc(100% - 62px)';
      var beforeDrawer = hasLeftDrawer ? _react["default"].createElement(_antd.Drawer, {
        placement: "left",
        mask: false,
        closable: false,
        visible: openLeft,
        getContainer: function getContainer() {
          return _this2._beforeDrawer.current;
        },
        bodyStyle: styles.drawerPaper,
        width: drawerWidth,
        style: drawerStyle
      }, _react["default"].createElement("div", {
        style: styles.drawerHeader
      }, _react["default"].createElement("div", {
        style: styles.title
      }, leftTitle), _react["default"].createElement(_antd.Icon, {
        type: "left-square-o",
        onClick: function onClick() {
          return _this2.handleLeftDrawer(false);
        }
      })), _react["default"].createElement(_antd.Divider, null), _react["default"].createElement(LeftDrawer, {
        className: "hc-layout-flexContent-leftDrawer"
      })) : null;
      var afterDrawer = hasRightDrawer ? _react["default"].createElement(_antd.Drawer, {
        placement: "right",
        mask: false,
        closable: false,
        visible: openRight,
        getContainer: function getContainer() {
          return _this2._afterDrawer.current;
        },
        bodyStyle: styles.drawerPaper,
        width: drawerWidth,
        style: drawerStyle
      }, _react["default"].createElement("div", {
        style: styles.drawerHeaderRight
      }, _react["default"].createElement(_antd.Icon, {
        type: "right-square-o",
        onClick: function onClick() {
          return _this2.handleRightDrawer(false);
        }
      }), _react["default"].createElement("div", {
        style: styles.title
      }, rightTitle)), _react["default"].createElement(_antd.Divider, null), _react["default"].createElement(RightDrawer, {
        className: "hc-layout-flexContent-rightDrawer"
      })) : null;

      var Head = _react["default"].createElement("div", {
        className: "hc-layout-flexContent-iconbox"
      }, hasLeftDrawer ? _react["default"].createElement(_antd.Icon, {
        type: "compass",
        onClick: this.handleLeftDrawer,
        style: openLeft ? styles.iconSelected : {}
      }) : null, hasRightDrawer ? _react["default"].createElement(_antd.Icon, {
        type: "appstore-o",
        onClick: this.handleRightDrawer,
        style: openRight ? styles.iconSelected : {}
      }) : null, hasStepConnector ? _react["default"].createElement("div", {
        className: "hc-layout-flexContent-connector"
      }, _react["default"].createElement(StepConnector, null)) : null, _react["default"].createElement(BreadCrumb, {
        className: "hc-layout-flexContent-breadCrumb",
        style: {
          marginLeft: hasLeftDrawer ? 35 : 0,
          marginRight: hasRightDrawer ? 35 : 0,
          paddingTop: 8
        }
      }));

      return _react["default"].createElement("div", {
        className: 'hc-layout-flexContent ' + className,
        style: _extends({}, style, styles.root)
      }, affix ? _react["default"].createElement(_antd.Affix, null, Head) : Head, _react["default"].createElement("div", {
        style: styles.appFrame
      }, _react["default"].createElement("div", {
        ref: this._beforeDrawer
      }), beforeDrawer, _react["default"].createElement("main", {
        style: _extends({
          minHeight: document.body.offsetHeight - 107
        }, styles.content, mainStyle, openLeft ? {
          marginLeft: drawerWidth
        } : styles['contentShift-left'], openRight ? {
          marginRight: drawerWidth
        } : styles['contentShift-right'])
      }, _react["default"].createElement("div", {
        style: styles.drawerHeader
      }), _react["default"].createElement(_antd.Card, {
        bordered: false,
        className: "hc-layout-flexContent-body",
        style: contentStyle
      }, _react["default"].createElement("div", {
        className: "hc-layout-flexContent-body_wrap",
        style: {
          width: hasOverview ? 'calc(100% - ' + overviewWidth + 'px)' : ''
        }
      }, this.props.viewContent || this.props.children), _react["default"].createElement("div", {
        className: "hc-layout-flexContent-body_overview",
        style: {
          flexBasis: overviewWidth,
          display: hasOverview ? '' : 'none'
        }
      }, _react["default"].createElement(Overview, null))), _react["default"].createElement(Combox, null), _react["default"].createElement(Footer, {
        className: "hc-layout-flexContent-footer"
      })), _react["default"].createElement("div", {
        ref: this._afterDrawer
      }), afterDrawer));
    }
  }]);

  return FlexContentLayout;
}(_basicLayout.BasicLayout);

exports.FlexContentLayout = FlexContentLayout;
FlexContentLayout.layoutBlocks = {
  Footer: _footer.Footer,
  BreadCrumb: _breadCrumb.BreadCrumb
};
FlexContentLayout.propTypes = {
  className: _propTypes["default"].string,
  leftTitle: _propTypes["default"].node,
  rightTitle: _propTypes["default"].node,
  drawerStyle: _propTypes["default"].object,
  openLeft: _propTypes["default"].bool,
  openRight: _propTypes["default"].bool,
  hasSider: _propTypes["default"].bool,
  drawerWidth: _propTypes["default"].number,
  zIndex: _propTypes["default"].number,
  affix: _propTypes["default"].bool,
  style: _propTypes["default"].object,
  mainStyle: _propTypes["default"].object,
  contentStyle: _propTypes["default"].object
};
FlexContentLayout.defaultProps = {
  drawerWidth: 200,
  overviewWidth: 250,
  affix: true,
  style: {},
  mainStyle: {},
  contentStyle: {}
};