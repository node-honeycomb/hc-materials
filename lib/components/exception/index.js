"use strict";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
  }
  return t;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var navLink_1 = require("../navLink");
/**
 * data = {
 *  title,
 *  desc,
 *  img
 * }
 */

/* eslint-disable react/prop-types */


exports.Exception = function (_a) {
  var className = _a.className,
      data = _a.data,
      links = _a.links,
      rest = __rest(_a, ["className", "data", "links"]);

  return React.createElement("div", _extends({
    className: 'hc-exception ' + className
  }, rest), React.createElement("div", {
    className: "hc-exception-imgBlock"
  }, React.createElement("div", {
    className: "hc-exception-imgEle",
    style: {
      backgroundImage: "url(" + data.img + ")"
    }
  })), React.createElement("div", {
    className: "hc-exception-content"
  }, React.createElement("h1", null, data.title), React.createElement("div", {
    className: "hc-exception-desc"
  }, data.desc), links && React.createElement("div", {
    className: "hc-exception-links"
  }, React.createElement(navLink_1.NavLink, {
    links: links
  }))));
};