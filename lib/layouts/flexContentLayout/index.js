"use strict";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var prop_types_1 = require("prop-types");

var card_1 = require("antd/lib/card");

var affix_1 = require("antd/lib/affix");

var icon_1 = require("antd/lib/icon");

var drawer_1 = require("antd/lib/drawer");

var divider_1 = require("antd/lib/divider");

var breadCrumb_1 = require("../../components/breadCrumb");

var Footer_1 = require("../../components/Footer");

var basicLayout_1 = require("../basicLayout");

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
/** @class */
function (_super) {
  __extends(FlexContentLayout, _super);

  function FlexContentLayout(props) {
    var _this = _super.call(this, props) || this;

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
      zIndex: _this.props.zIndex || 1000
    }, props.drawerStyle);

    _this.state = {
      openLeft: !!_this.props.openLeft,
      openRight: !!_this.props.openRight,
      drawerStyle: drawerStyle
    };
    return _this;
  }

  FlexContentLayout.prototype.render = function () {
    var _this = this;

    var Footer = this.getComponent('Footer');
    var BreadCrumb = this.getComponent('BreadCrumb');
    var LeftDrawer = this.getComponent('LeftDrawer');
    var RightDrawer = this.getComponent('RightDrawer');
    var Overview = this.getComponent('Overview');
    var Combox = this.getComponent('Combox');
    var _a = this.props,
        className = _a.className,
        drawerWidth = _a.drawerWidth,
        overviewWidth = _a.overviewWidth,
        leftTitle = _a.leftTitle,
        rightTitle = _a.rightTitle,
        affix = _a.affix,
        style = _a.style,
        mainStyle = _a.mainStyle;
    var _b = this.state,
        drawerStyle = _b.drawerStyle,
        openLeft = _b.openLeft,
        openRight = _b.openRight;
    var hasOverview = this.hasComponent('Overview');
    var hasLeftDrawer = this.hasComponent('LeftDrawer');
    var hasRightDrawer = this.hasComponent('RightDrawer');
    var StepConnector = this.getComponent('StepConnector');
    var hasStepConnector = this.hasComponent('StepConnector');
    var beforeDrawer = hasLeftDrawer ? React.createElement(drawer_1["default"], {
      open: openLeft,
      style: styles.drawerPaper,
      width: drawerWidth,
      containerStyle: drawerStyle
    }, React.createElement("div", {
      style: styles.drawerHeader
    }, React.createElement("div", {
      style: styles.title
    }, leftTitle), React.createElement(icon_1["default"], {
      type: "left-square-o",
      onClick: function onClick() {
        return _this.handleLeftDrawer(false);
      }
    })), React.createElement(divider_1["default"], null), React.createElement(LeftDrawer, {
      className: "hc-layout-flexContent-leftDrawer"
    })) : null;
    var afterDrawer = hasRightDrawer ? React.createElement(drawer_1["default"], {
      openSecondary: true,
      open: openRight,
      style: styles.drawerPaper,
      width: drawerWidth,
      containerStyle: drawerStyle
    }, React.createElement("div", {
      style: styles.drawerHeaderRight
    }, React.createElement(icon_1["default"], {
      type: "right-square-o",
      onClick: function onClick() {
        return _this.handleRightDrawer(false);
      }
    }), React.createElement("div", {
      style: styles.title
    }, rightTitle)), React.createElement(divider_1["default"], null), React.createElement(RightDrawer, {
      className: "hc-layout-flexContent-rightDrawer"
    })) : null;
    var Head = React.createElement("div", {
      className: "hc-layout-flexContent-iconbox"
    }, hasLeftDrawer ? React.createElement(icon_1["default"], {
      type: "compass",
      onClick: this.handleLeftDrawer,
      style: openLeft ? styles.iconSelected : {}
    }) : null, hasRightDrawer ? React.createElement(icon_1["default"], {
      type: "appstore-o",
      onClick: this.handleRightDrawer,
      style: openRight ? styles.iconSelected : {}
    }) : null, hasStepConnector ? React.createElement("div", {
      className: "hc-layout-flexContent-connector"
    }, React.createElement(StepConnector, null)) : null, React.createElement(BreadCrumb, {
      className: "hc-layout-flexContent-breadCrumb",
      style: {
        marginLeft: hasLeftDrawer ? 35 : 0,
        marginRight: hasRightDrawer ? 35 : 0
      }
    }));
    return React.createElement("div", {
      className: 'hc-layout-flexContent ' + className,
      style: _extends(style, styles.root)
    }, affix ? React.createElement(affix_1["default"], null, Head) : Head, React.createElement("div", {
      style: styles.appFrame
    }, beforeDrawer, React.createElement("main", {
      style: _extends({
        minHeight: document.body.offsetHeight - 107
      }, styles.content, mainStyle, openLeft ? {
        marginLeft: drawerWidth
      } : styles['contentShift-left'], openRight ? {
        marginRight: drawerWidth
      } : styles['contentShift-right'])
    }, React.createElement("div", {
      style: styles.drawerHeader
    }), React.createElement(card_1["default"], {
      bordered: false,
      className: "hc-layout-flexContent-body",
      style: this.props.contentStyle
    }, React.createElement("div", {
      className: "hc-layout-flexContent-body_wrap",
      style: {
        width: hasOverview ? 'calc(100% - ' + overviewWidth + 'px)' : ''
      }
    }, this.props.viewContent || this.props.children), React.createElement("div", {
      className: "hc-layout-flexContent-body_overview",
      style: {
        flexBasis: overviewWidth,
        display: hasOverview ? '' : 'none'
      }
    }, React.createElement(Overview, null))), React.createElement(Combox, null), React.createElement(Footer, {
      className: "hc-layout-flexContent-footer"
    })), afterDrawer));
  };

  FlexContentLayout.layoutBlocks = {
    Footer: Footer_1.Footer,
    BreadCrumb: breadCrumb_1.BreadCrumb
  };
  FlexContentLayout.propTypes = {
    className: prop_types_1["default"].string,
    leftTitle: prop_types_1["default"].node,
    rightTitle: prop_types_1["default"].node,
    drawerStyle: prop_types_1["default"].object,
    openLeft: prop_types_1["default"].bool,
    openRight: prop_types_1["default"].bool,
    hasSider: prop_types_1["default"].bool,
    drawerWidth: prop_types_1["default"].number,
    zIndex: prop_types_1["default"].number,
    affix: prop_types_1["default"].bool,
    style: prop_types_1["default"].object,
    mainStyle: prop_types_1["default"].object,
    contentStyle: prop_types_1["default"].object
  };
  FlexContentLayout.defaultProps = {
    drawerWidth: 200,
    overviewWidth: 250,
    affix: true,
    style: {},
    mainStyle: {}
  };
  return FlexContentLayout;
}(basicLayout_1.BasicLayout);

exports.FlexContentLayout = FlexContentLayout;