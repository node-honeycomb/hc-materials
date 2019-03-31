import React from 'react';
import PropTypes from 'prop-types';
import {getComponent} from './getComponent';

function loop(arrOrMap, callback) {
  if (Array.isArray(arrOrMap)) {
    arrOrMap.forEach(callback);
  } else {
    for (let key in arrOrMap) {
      const item = arrOrMap[key];
      const newItem = {key: key};
      if (typeof item === 'function') {
        if (item.prototype && item.prototype.isReactComponent) {
          newItem.component = item;
        } else {
          newItem.getProps = item;
        }
      } else if (item === false) {
        newItem.props = false;
      } else {
        Object.assign(newItem, item);
      }
      callback(newItem);
    }
  }
}

export class BasicLayout extends React.PureComponent {
  static getLayoutProps = function (option, viewContent) {
    option.__widgets__ = option.__widgets__ || {};
    const layoutProps = Object.assign({
      route: option.route,
      viewContent: viewContent,
      components: Object.assign({}, option.__widgets__),
      style: option.style
    }, option.props);
    const layoutBlocks = Object.assign({}, this.layoutBlocks);
    loop(option.components, (item) => {
      const Com = item.component || layoutBlocks[item.key];
      if (Com) {
        delete item.component;
        delete layoutBlocks[item.key];
        layoutProps.components[item.key] = layoutProps.components[item.key] || getComponent(item.props, item.getProps)(Com);
        if (item.props && item.static) {
          option.__widgets__[item.key] = layoutProps.components[item.key];
        }
      }
    });
    for (let name in layoutBlocks) {
      layoutProps.components[name] = layoutProps.components[name];
      if (layoutBlocks[name].props && layoutBlocks[name].static) {
        option.__widgets__[name] = layoutProps.components[name];
      }
    }
    const customLayoutProps = this.displayName && option[this.displayName];
    for (let key in customLayoutProps) {
      if (key === 'components') {
        Object.assign(layoutProps.components, customLayoutProps[key]);
      } else {
        layoutProps[key] = customLayoutProps[key];
      }
    }
    return layoutProps;
  }

  static propTypes = {
    className: PropTypes.string,
    components: PropTypes.object,
    viewContent: PropTypes.element,
    children: PropTypes.element,
    style: PropTypes.object
  }

  static defaultProps = {
    className: '',
    components: {}
  }

  getComponent(name) {
    return this.props.components[name] || getComponent.emptyComponent;
  }

  hasComponent(name) {
    return this.props.components[name] && this.props.components[name] !== getComponent.emptyComponent;
  }
}
