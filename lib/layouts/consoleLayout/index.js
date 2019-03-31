"use strict";

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

var layout_1 = require("antd/lib/layout");

var sider_1 = require("../../components/sider");

var header_1 = require("../../components/header");

var basicLayout_1 = require("../basicLayout");

var COLLAPSED_KEY = 'beatle_console_sidebar';

var ConsoleLayout =
/** @class */
function (_super) {
  __extends(ConsoleLayout, _super);

  function ConsoleLayout(props, context) {
    var _this = _super.call(this, props) || this;

    _this.state = {
      inited: true,
      collapsed: context.localStorage && context.localStorage.get(COLLAPSED_KEY) === 'true' || false
    };
    return _this;
  }

  ConsoleLayout.prototype.render = function () {
    var _this = this;

    var collapseCfg = {
      collapsed: this.state.collapsed,
      onCollapse: function onCollapse(collapsed) {
        // if (this.state.inited && this.state.collapsed) {
        //   this.setState({inited: false});
        //   return;
        // }
        _this.setState({
          collapsed: collapsed,
          inited: false
        });

        _this.context.localStorage && _this.context.localStorage.set(COLLAPSED_KEY, collapsed);
      }
    };
    var Sider = this.getComponent('Sider');
    var Header = this.getComponent('Header');
    return React.createElement("div", {
      className: 'hc-layout-console ' + this.props.className,
      style: this.props.style
    }, React.createElement(layout_1["default"], {
      className: "hc-layout-console_has-sider"
    }, React.createElement(Sider, collapseCfg), React.createElement(layout_1["default"], null, React.createElement(Header, collapseCfg), React.createElement(layout_1["default"].Content, {
      className: "hc-layout-console-body"
    }, this.props.viewContent || this.props.children))));
  };

  ConsoleLayout.layoutBlocks = {
    Header: header_1.Header,
    Sider: sider_1.Sider
  };
  ConsoleLayout.propTypes = {
    className: prop_types_1["default"].string,
    style: prop_types_1["default"].object
  };
  ConsoleLayout.defaultProps = {
    className: ''
  };
  ConsoleLayout.contextTypes = {
    localStorage: prop_types_1["default"].object.isRequired
  };
  return ConsoleLayout;
}(basicLayout_1.BasicLayout);

exports.ConsoleLayout = ConsoleLayout;