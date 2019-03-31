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

var card_1 = require("antd/lib/card");

var footer_1 = require("../../components/footer");

var breadCrumb_1 = require("../../components/breadCrumb");

var basicLayout_1 = require("../basicLayout");

var ContentLayout =
/** @class */
function (_super) {
  __extends(ContentLayout, _super);

  function ContentLayout() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  ContentLayout.prototype.render = function () {
    var Footer = this.getComponent('Footer');
    var BreadCrumb = this.getComponent('BreadCrumb');
    return React.createElement("div", {
      className: 'hc-layout-content ' + this.props.className,
      style: this.props.style
    }, React.createElement(BreadCrumb, {
      className: "hc-layout-content-breadCrumb"
    }), React.createElement("div", {
      className: "hc-layout-content-body"
    }, React.createElement(card_1["default"], {
      bordered: false
    }, this.props.viewContent || this.props.children)), React.createElement(Footer, {
      className: "hc-layout-content-footer"
    }));
  };

  ContentLayout.layoutBlocks = {
    Footer: footer_1.Footer,
    BreadCrumb: breadCrumb_1.BreadCrumb
  };
  return ContentLayout;
}(basicLayout_1.BasicLayout);

exports.ContentLayout = ContentLayout;