import React from 'react';
import PropTypes from 'prop-types';
import {getComponent} from '../layouts/getComponent';
import {converter} from './layerConvertor';

export function getCombox({cname, componentType, props, getProps, hoc, className, contextTypes}, findComponent) {
  class Combox extends React.PureComponent {
    constructor(tprops, context) {
      super(tprops);

      const _getProps = converter.parse(getProps);
      const propsMap = _getProps ? _getProps.call(this, tprops, context) : props || {};
      this.state = {
        components: cname.map(n => {
          const item = propsMap[n];
          item.cname = item.cname || n;
          item.componentType = item.componentType || componentType;

          let Component;
          if (Array.isArray(item.cname)) {
            Component = getCombox(item, findComponent, () => {
              return Component.contextTypes;
            });
          } else {
            Component = findComponent(item) || getComponent.emptyComponent;
          }
          return {
            Component: Component,
            key: n
          };
        })
      };
    }
    render() {
      return (<div className={'hc-combox ' + (className || '')}>{this.state.components.map(item => {
        return (<item.Component key={item.key} {...this.props} />);
      })}</div>);
    }
  }
  if (contextTypes) {
    Combox.contextTypes = {};
    contextTypes.forEach(name => {
      Combox.contextTypes[name] = PropTypes.object;
    });
  }
  if (hoc) {
    const Com = findComponent(hoc);
    if (!Com) {
      window.console.log('hoc组件丢失');
    }
    const ChildComponent = Combox;
    const childProps = hoc.childProps || {};
    class HocCombox extends React.PureComponent {
      render() {
        const children = (<Com ref={inst => this._childRef = inst}><HocCombox.ChildComponent {...childProps} {...this.props} /></Com>);
        // #! 包裹
        const wrapper = converter.parse(hoc.wrapper);
        if (wrapper) {
          return wrapper(children, this._childRef.context);
        } else {
          return children;
        }
      }
    }
    HocCombox.ChildComponent = ChildComponent;
    HocCombox._async = ChildComponent._async;

    return HocCombox;
  } else {
    return Combox;
  }
}
