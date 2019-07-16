"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Exception = void 0;

var _react = _interopRequireDefault(require("react"));

var _navLink = require("../navLink");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

/**
 * data = {
 *  title,
 *  desc,
 *  img
 * }
 */

/* eslint-disable react/prop-types */
var Exception = function Exception(_a) {
  var className = _a.className,
      data = _a.data,
      links = _a.links,
      rest = __rest(_a, ["className", "data", "links"]);

  return _react["default"].createElement("div", _extends({
    className: 'hc-exception ' + className
  }, rest), _react["default"].createElement("div", {
    className: "hc-exception-imgBlock"
  }, _react["default"].createElement("div", {
    className: "hc-exception-imgEle",
    style: {
      backgroundImage: "url(".concat(data.img, ")")
    }
  })), _react["default"].createElement("div", {
    className: "hc-exception-content"
  }, _react["default"].createElement("h1", null, data.title), _react["default"].createElement("div", {
    className: "hc-exception-desc"
  }, data.desc), links && _react["default"].createElement("div", {
    className: "hc-exception-links"
  }, _react["default"].createElement(_navLink.NavLink, {
    links: links
  }))));
};

exports.Exception = Exception;