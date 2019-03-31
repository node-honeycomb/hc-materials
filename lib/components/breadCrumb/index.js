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

var react_router_dom_1 = require("react-router-dom");

var breadcrumb_1 = require("antd/lib/breadcrumb");

var navLink_1 = require("../navLink");

var BreadCrumb =
/** @class */
function (_super) {
  __extends(BreadCrumb, _super);

  function BreadCrumb() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  BreadCrumb.prototype.render = function () {
    var _a = this.props,
        className = _a.className,
        style = _a.style,
        navs = _a.navs,
        links = _a.links,
        extra = _a.extra;
    return React.createElement("div", {
      className: 'hc-breadcrumb ' + className,
      style: style
    }, React.createElement(breadcrumb_1["default"], null, navs.map(function (item, index) {
      if (item.link) {
        return React.createElement(breadcrumb_1["default"].Item, {
          key: index
        }, React.createElement(react_router_dom_1.Link, {
          to: item.link
        }, item.text));
      } else {
        return React.createElement(breadcrumb_1["default"].Item, {
          key: index
        }, item.text);
      }
    }), links || extra ? React.createElement(breadcrumb_1["default"].Item, {
      className: "hc-breadcrumb-extra"
    }, links && React.createElement(navLink_1.NavLink, {
      links: links
    }), extra) : null), this.props.combox);
  };

  BreadCrumb.parse = function (route, subRoutes) {
    var navs = [];

    if (route) {
      navs.push({
        text: route.title
      });

      if (route.navKey && subRoutes[route.navKey]) {
        navs.unshift({
          text: subRoutes[route.navKey].title || route.navKey
        });
      }

      while ((route = route.parent) && route.title) {
        navs.unshift({
          link: route.resolvePath,
          text: route.title
        });
      }
    }

    return navs;
  };

  BreadCrumb.propTypes = {
    className: prop_types_1["default"].string,
    style: prop_types_1["default"].object,
    combox: prop_types_1["default"].element,
    navs: prop_types_1["default"].array,
    links: prop_types_1["default"].array,
    extra: prop_types_1["default"].any
  };
  BreadCrumb.defaultProps = {
    className: '',
    navs: []
  };
  return BreadCrumb;
}(react_1["default"].PureComponent);

exports.BreadCrumb = BreadCrumb;