function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var __rest = this && this.__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

import React from 'react';
import { Icon } from 'antd';
import { NavLink } from '../navLink';
/* eslint-disable react/prop-types */

export function Result(_a) {
  var className = _a.className,
      type = _a.type,
      title = _a.title,
      description = _a.description,
      extra = _a.extra,
      links = _a.links,
      restProps = __rest(_a, ["className", "type", "title", "description", "extra", "links"]);

  var iconMap = {
    error: React.createElement(Icon, {
      className: "error",
      type: "close-circle"
    }),
    success: React.createElement(Icon, {
      className: "success",
      type: "check-circle"
    })
  };
  return React.createElement("div", _extends({
    className: 'hc-result ' + className
  }, restProps), React.createElement("div", {
    className: "hc-result-icon"
  }, iconMap[type]), React.createElement("div", {
    className: "hc-result-title"
  }, title), description && React.createElement("div", {
    className: "hc-result-description"
  }, description), extra && React.createElement("div", {
    className: "hc-result-extra"
  }, extra), links && React.createElement("div", {
    className: "hc-result-actions"
  }, React.createElement(NavLink, {
    links: links
  })));
}