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

var layout_1 = require("antd/lib/layout");

var react_router_dom_1 = require("react-router-dom");

var footer_1 = require("../../components/footer");

var basicLayout_1 = require("../basicLayout");

var sider_1 = require("../../components/sider");

var header_1 = require("../../components/header");
/* eslint-disable react/prop-types */


function Brand(_a) {
  var logo = _a.logo,
      title = _a.title,
      description = _a.description;
  return React.createElement("div", {
    className: "hc-layout-landing-top"
  }, React.createElement("div", {
    className: "hc-layout-landing-header"
  }, React.createElement(react_router_dom_1.Link, {
    to: "/"
  }, React.createElement("img", {
    alt: "",
    className: "hc-layout-landing-logo",
    src: logo
  }), React.createElement("span", {
    className: "hc-layout-landing-title"
  }, title))), description ? React.createElement("p", {
    className: "hc-layout-landing-desc"
  }, description) : null);
}

var LandingLayout =
/** @class */
function (_super) {
  __extends(LandingLayout, _super);

  function LandingLayout() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  LandingLayout.prototype.render = function () {
    var Footer = this.getComponent('Footer');
    var Brand = this.getComponent('Brand');
    var Header = this.getComponent('Header');
    var style = this.props.style || {
      padding: '110px 0 144px'
    };
    return React.createElement("div", {
      className: 'hc-layout-landing ' + this.props.className,
      style: style
    }, React.createElement(layout_1["default"], null, React.createElement(Header, {
      noSider: true,
      Menu: sider_1.Sider
    }), React.createElement(layout_1["default"].Content, null, React.createElement(Brand, null), this.props.viewContent || this.props.children, React.createElement(Footer, {
      className: "hc-layout-landing-footer"
    }))));
  };

  LandingLayout.displayName = 'LandingLayout';
  LandingLayout.layoutBlocks = {
    Footer: footer_1.Footer,
    Brand: Brand,
    Header: header_1.Header
  };
  return LandingLayout;
}(basicLayout_1.BasicLayout);

exports.LandingLayout = LandingLayout;