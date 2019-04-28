"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Result = Result;

var _react = _interopRequireDefault(require("react"));

var _antd = require("antd");

var _navLink = require("../navLink");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

/* eslint-disable react/prop-types */
function Result(_a) {
  var className = _a.className,
      type = _a.type,
      title = _a.title,
      description = _a.description,
      extra = _a.extra,
      links = _a.links,
      restProps = __rest(_a, ["className", "type", "title", "description", "extra", "links"]);

  var iconMap = {
    error: _react["default"].createElement(_antd.Icon, {
      className: "error",
      type: "close-circle"
    }),
    success: _react["default"].createElement(_antd.Icon, {
      className: "success",
      type: "check-circle"
    })
  };
  return _react["default"].createElement("div", _extends({
    className: 'hc-result ' + className
  }, restProps), _react["default"].createElement("div", {
    className: "hc-result-icon"
  }, iconMap[type]), _react["default"].createElement("div", {
    className: "hc-result-title"
  }, title), description && _react["default"].createElement("div", {
    className: "hc-result-description"
  }, description), extra && _react["default"].createElement("div", {
    className: "hc-result-extra"
  }, extra), links && _react["default"].createElement("div", {
    className: "hc-result-actions"
  }, _react["default"].createElement(_navLink.NavLink, {
    links: links
  })));
}