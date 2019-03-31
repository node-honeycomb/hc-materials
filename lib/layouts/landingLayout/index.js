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

var globalFooter_1 = require("../../components/globalFooter");

var basicLayout_1 = require("../basicLayout");

var sider_1 = require("../../components/sider");

var header_1 = require("../../components/header");
/* eslint-disable react/prop-types */


function Brand(_a) {
  var logo = _a.logo,
      title = _a.title,
      description = _a.description,
      Link = _a.Link;
  return React.createElement("div", {
    className: "j-top"
  }, React.createElement("div", {
    className: "j-header"
  }, React.createElement(Link, {
    to: "/"
  }, React.createElement("img", {
    alt: "",
    className: "j-logo",
    src: logo
  }), React.createElement("span", {
    className: "j-title"
  }, title))), description ? React.createElement("p", {
    className: "j-desc"
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
    var BLink = this.getComponent('Link');
    var Brand = this.getComponent('Brand');
    var Header = this.getComponent('Header');
    var style = this.props.style || {
      padding: '110px 0 144px'
    };
    return React.createElement("div", {
      className: 'j-layout-landing ' + this.props.className,
      style: style
    }, React.createElement(layout_1["default"], null, React.createElement(Header, {
      noSider: true,
      Menu: sider_1.Sider
    }), React.createElement(layout_1["default"].Content, null, React.createElement(Brand, {
      Link: BLink
    }), this.props.viewContent || this.props.children, React.createElement(Footer, {
      className: "j-footer"
    }))));
  };

  LandingLayout.displayName = 'LandingLayout';
  LandingLayout.layoutBlocks = {
    Footer: globalFooter_1.GlobalFooter,
    Link: react_router_dom_1.Link,
    Brand: Brand,
    Header: header_1.Header
  };
  return LandingLayout;
}(basicLayout_1.BasicLayout);

exports.LandingLayout = LandingLayout;