function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import upperFirst from 'lodash/upperFirst';
import defaultsDeep from 'lodash/defaultsDeep';

var context = require.context('./', true, /^((?!style).)+\/\w+\.jsx?$/);

var exportObj = {};
context.keys().forEach(function (key) {
  _extends(exportObj, context(key));
});
/**
 * option = {layoutOption, layout, route}
 */

export function getLayout(option, viewContent) {
  var CustomLayouts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (option.route && option.route.layout) {
    defaultsDeep(option.layoutOption, option.route.layoutOption, {
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
    Layout = CustomLayouts[layoutType] || exportObj[upperFirst(layoutType)] || exportObj['ConsoleLayout'];
  }

  var layoutProps = Layout.getLayoutProps(option.layoutOption, viewContent);
  viewContent = React.createElement(Layout, layoutProps);

  if (layouts.length > 1) {
    option.layout = layouts.slice(0, -1);
    return getLayout(option, viewContent, CustomLayouts);
  } else {
    return viewContent;
  }
}