import React from 'react';
import PropTypes from 'prop-types';
import upperFirst from 'lodash/upperFirst';

import {getComponent} from '../layouts/getComponent';
import {converter} from './layerConvertor';
const hcGetComponent = getComponent;

export const gallery = {
  layouts: {
    name: 'layout',
    items: {}
  },
  services: {
    name: 'service',
    items: {}
  },
  layers: {
    name: 'layer',
    items: {}
  },
  components: {
    name: 'component',
    items: {
      custom: {name: 'custom', items: {}},
      hc: {name: 'hc', items: {}},
      antd: {name: 'antd', items: {}},
      material: {name: 'material', items: {}}
    }
  }
};

export function findComponent(...args) {
  let cname;
  let componentType;
  let component;
  let getComponent;
  let contextTypes;
  let hoc;
  let props;
  let getProps;
  let galleryType;
  let original;

  if (Object(args[0]) === args[0]) {
    ({cname, componentType, component, props, getProps, getComponent, contextTypes, hoc} = args[0]);
    original = args[1];
    galleryType = args[2];
  } else {
    [cname, componentType, component, props, getProps, getComponent, contextTypes, hoc, original, galleryType] = args;
  }
  const decorative = !original;

  const componentList = galleryType ? gallery[galleryType] : (gallery.components.items[componentType] || gallery.components.items['custom']);

  let newComponent;
  let async;
  if (getComponent) {
    newComponent = converter.parse(getComponent);
    async = true;
    newComponent._async = async;
  } else {
    if (typeof component === 'function') {
      // 本身就是组件
      newComponent = component;
    } else if (cname) {
      /**
       * com = {
       *  componentType: [antd|custom|hc|material],
       *  cname: 'x',
       *  props: {
       *    ...
       *  }
       * }
       */
      const cs = cname.split('.');
      newComponent = componentList.items[cs.shift()];
      // Button.Group
      while (newComponent && cs.length) {
        newComponent = newComponent[cs.shift()];
      }
    }
  }

  if (newComponent) {
    const newContextTypes = {};
    if (contextTypes) {
      contextTypes.forEach(name => {
        newContextTypes[name] = PropTypes.any;
      });
      if (newComponent.contextTypes) {
        Object.assign(newComponent.contextTypes, newContextTypes);
      } else {
        newComponent.contextTypes = newContextTypes;
      }
    }

    if (decorative) {
      if (async) {
        props = props || {};
      }
      newComponent = hcGetComponent(props, converter.parse(getProps))(newComponent);
    }

    // 一般来说和view不能共用
    if (hoc) {
      const Com = findComponent(hoc);
      if (!Com) {
        window.console.log('hoc组件丢失');
      }
      const ChildComponent = newComponent;
      const childProps = hoc.childProps || {};
      class HocComponent extends React.PureComponent {
        render() {
          const children = (<Com ref={inst => this._childRef = inst} ><newComponent.ChildComponent {...childProps} {...this.props} /></Com>);
          // #! 包裹
          const wrapper = converter.parse(hoc.wrapper);
          if (wrapper) {
            return wrapper(children, this._childRef.context);
          } else {
            return children;
          }
        }
      }
      newComponent = HocComponent;
      newComponent.ChildComponent = ChildComponent;
      newComponent._async = ChildComponent._async;
    }
  }
  return newComponent;
}

export const findService = (name) => {
  return gallery.services.items[name];
};


export function setGallery(aGallery) {
  for (let key in aGallery) {
    if (key === 'components') {
      for (let ikey in aGallery[key]) {
        window[upperFirst(ikey)] = aGallery[key][ikey];
        Object.assign(gallery[key].items[ikey].items, aGallery[key][ikey]);
      }
    } else {
      Object.assign(gallery[key].items, aGallery[key]);
    }
  }
}
