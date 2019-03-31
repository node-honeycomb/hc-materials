import React from 'react';
import upperFirst from 'lodash/upperFirst';
import defaultsDeep from 'lodash/defaultsDeep';

const context = require.context('./', true, /\w+\/\w+\.(jsx|js)$/);

const exportObj = {};
context
  .keys()
  .forEach(key => {
    Object.assign(exportObj, context(key));
  });
/**
 * option = {layoutOption, layout, route}
 */
export function getLayout(option, viewContent, CustomLayouts = {}) {
  if (option.route && option.route.layout) {
    defaultsDeep(option.layoutOption, option.route.layoutOption, {route: option.route});
    option.layout = option.route.layout;
    delete option.route;
  }

  const layouts = Array.isArray(option.layout) ? option.layout : [option.layout];
  const layoutType = layouts[layouts.length - 1];
  let Layout;
  if (Object(layoutType) === layoutType) {
    Layout = layoutType;
  } else {
    Layout = CustomLayouts[layoutType] || exportObj[upperFirst(layoutType)] || exportObj['ConsoleLayout'];
  }

  const layoutProps = Layout.getLayoutProps(option.layoutOption, viewContent);
  viewContent = (<Layout {...layoutProps} />);
  if (layouts.length > 1) {
    option.layout = layouts.slice(0, -1);
    return getLayout(option, viewContent, CustomLayouts);
  } else {
    return viewContent;
  }
}
