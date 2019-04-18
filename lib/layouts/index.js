"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLayout = getLayout;

var _react = _interopRequireDefault(require("react"));

var _upperFirst = _interopRequireDefault(require("lodash/upperFirst"));

var _defaultsDeep = _interopRequireDefault(require("lodash/defaultsDeep"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var context = require.context('./', true, /\w+\/\w+\.(jsx|js)$/);

var exportObj = {};
context.keys().forEach(function (key) {
  _extends(exportObj, context(key));
});
/**
 * option = {layoutOption, layout, route}
 */

function getLayout(option, viewContent) {
  var CustomLayouts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (option.route && option.route.layout) {
    (0, _defaultsDeep["default"])(option.layoutOption, option.route.layoutOption, {
      route: option.route
    });
    option.layout = option.route.layout;
    delete option.route;
  }

  var layouts = Array.isArray(option.layout) ? option.layout : [option.layout];
  var layoutType = layouts[layouts.length - 1];
  var Layout;

  if (Object(layoutType) === layoutType) {
    Layout = layoutType;
  } else {
    Layout = CustomLayouts[layoutType] || exportObj[(0, _upperFirst["default"])(layoutType)] || exportObj['ConsoleLayout'];
  }

  var layoutProps = Layout.getLayoutProps(option.layoutOption, viewContent);
  viewContent = _react["default"].createElement(Layout, layoutProps);

  if (layouts.length > 1) {
    option.layout = layouts.slice(0, -1);
    return getLayout(option, viewContent, CustomLayouts);
  } else {
    return viewContent;
  }
}