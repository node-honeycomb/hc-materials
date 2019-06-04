import React from 'react';
import PropTypes from 'prop-types';

import cloneDeep from 'lodash/cloneDeep';
import forEach from 'lodash/forEach';
import isEqual from 'lodash/isEqual';
import isEqualWith from 'lodash/isEqualWith';
import {BaseSelector} from 'beatle';

import {converter} from './layerConvertor';
import {LayerItem, LayerGrid} from './layerEditor';
import {findService, findComponent, setGallery} from './galleryResolver';
import {getCombox} from './getCombox';
import {getComponent} from '../layouts/getComponent';
import {getLayout} from '../layouts';

import {Empty} from 'antd';

export class Layer {
  static resolveGallery = (callback) => callback({})

  static contextTypes = {
    app: PropTypes.object
  }

  constructor(context, callback) {
    this.context = context;
    this._promise = new Promise(resolve => {
      Layer.resolveGallery(gallery => {
        gallery && setGallery(gallery);
        resolve(true);
        callback && callback();
      });
    });
    this._editable = false;
    this._activeFuns = [];
    this._watcherFns = [];

    this.state = {};
    // TODO Object to immutable
    this._state = Object(this.state);
  }

  ready(callback) {
    this._promise.then(callback);
  }

  setState(nextState) {
    const prevState = this.state;
    this.state = Object.assign({}, prevState, nextState);
    this._state = Object(this.state);

    this._watcherFns.forEach(fn => {
      fn.watcher(nextState, prevState);
    });
  }

  watch(watcher, callback) {
    const name = typeof watcher === 'function' ? null : watcher;
    if (name) {
      watcher = (nextState, prevStore) => {
        if (nextState[fnOpt.name] !== prevStore[fnOpt.name]) {
          fnOpt.resolve(nextState);
          fnOpt.resolved = false;
          fnOpt.promise = new Promise(resolve => {
            fnOpt.resolve = resolve;
          }).then(ret => {
            return fnOpt.callback && fnOpt.callback(ret);
          });
        }
      };
    }

    let fnOpt = this._watcherFns.find(fn => fn.name === name || fn.watch === watcher);
    if (!fnOpt) {
      fnOpt = {
        name: name,
        watcher: watcher,
        callback: callback,
        resolved: true
      };
      this._watcherFns.push(fnOpt);
    }
    if (fnOpt.resolved) {
      fnOpt.resolved = false;
      fnOpt.promise = new Promise(resolve => {
        fnOpt.resolve = resolve;
      }).then(ret => {
        return fnOpt.callback && fnOpt.callback(ret);
      });
    }
    return fnOpt.promise;
  }

  unwatch(watcher) {
    const idx = this._watcherFns.findIndex(fn => fn.name === watcher || fn.watch === watcher);
    if (idx > -1) {
      this._watcherFns.splice(idx, 1);
    }
  }

  // -----------------------------
  setEditable(editable) {
    this._editable = editable;
  }

  isEditable() {
    return this._editable;
  }

  register(id, callback) {
    this._activeFuns.push({
      id: id,
      fn: callback,
      active: false
    });
  }
  handleActive(id) {
    if (this._editable) {
      this._activeFns.forEach(afn => {
        afn.active = afn.id === id;
        afn.fn(afn.active);
      });
    }
  }
  // -----------------------------

  findComponent = findComponent;

  getComponent(component, props, getProps) {
    if (component._async) {
      props = props || {};
    }
    let contextTypes;
    let newComponent;
    if (component.ChildComponent) {
      contextTypes = component.ChildComponent.contextTypes;
      component.ChildComponent = getComponent(props, getProps)(component.ChildComponent);
      component.ChildComponent.contextTypes = contextTypes;

      newComponent = component;
    } else {
      contextTypes = component.contextTypes;
      newComponent = getComponent(props, getProps)(component);
      newComponent.contextTypes = contextTypes;
    }
    return newComponent;
  }
  /**
   * com = {
   *  key,            // 组件key，可不填
   *  componentType,  // 组件源，默认不填是custom，分别为： antd、material、custom
   *  cname,          // 组件名，在组件源内唯一
   *  component,      // 组件定义
   *  getComponent,   // 动态组件，cname、component、getComponent选择其一
   *  view,           // 组件升级成view，可拥有model和services特性
   *  props,          // 组件props属性
   *  getProps        // 组件props动态属性,
   *  attrs,          // 组件放在容器中的定位
   * }
   */
  parseComponent(opt, state) {
    /**
     * com = {
     *  componentType: [antd|custom|hc|material],
     *  cname: ['a', 'b'],
     *  props: {
     *    a: {
     *      ...
     *    },
     *    b: {
     *      componentType: [antd|custom|hc|material],
     *      component: 'x',
     *      ...
     *    }
     *  }
     * }
     */
    let newComponent;
    let props = opt.props;
    let getProps = converter.parse(opt.getProps);
    const cname = opt.cname;
    const componentOption =  {
      static: opt.static,
      attrs: opt.attrs,
      key: opt.key || cname
    };
    if (opt.layer) {
      const layer = opt.layer;
      newComponent = findComponent(layer, true, 'layers');
      const layerProps = this.parseLayer(layer.components, layer.props, layer.grid, layer.item, state);
      newComponent = this.toView(newComponent, layer.view, layerProps, getProps);
    } else {
      const view = opt.view;
      opt = this.enhanceComponent(opt, state);
      if (Array.isArray(cname)) {
        newComponent = getCombox(opt, findComponent, () => {
          return view ? newComponent.childContextTypes : newComponent.contextTypes;
        });
        props = view ? {} : null;
        getProps = null;
      } else {
        newComponent = findComponent(opt, true);
      }
      if (newComponent) {
        newComponent = this.toView(newComponent, view, props, getProps);
      } else {
        componentOption.props = props;
        componentOption.getProps = getProps;
        if (opt.contextTypes) {
          componentOption.contextTypes = {};
          opt.contextTypes.forEach(name => {
            componentOption.contextTypes[name] = PropTypes.object;
          });
        }
      }
    }
    componentOption.component = newComponent;
    return componentOption;
  }

  toView(component, viewOpt, props, getProps) {
    let newComponent = this.getComponent(component, props, getProps);
    if (viewOpt) {
      let providers;
      // const childContextTypes = {};
      if (viewOpt.providers) {
        providers = {};
        // 此处可能有问题
        forEach(viewOpt.providers, (provider, name) => {
          if (typeof name === 'number') {
            name = provider;
            provider = findService(name);
          }
          if (provider) {
            providers[name] = provider;
          }
          // childContextTypes[name] = PropTypes.object;
        });
      }
      if (viewOpt.selector) {
        const selector = new BaseSelector();
        Object.assign(selector, viewOpt.selector);
        newComponent = this.context.app.view(selector, newComponent, providers, viewOpt.bindings, viewOpt.hookActions, viewOpt.props, viewOpt.getProps);
      } else {
        newComponent = this.context.app.view(newComponent, providers, viewOpt.bindings, viewOpt.hookActions, viewOpt.props, viewOpt.getProps);
      }
      // newComponent.childContextTypes = childContextTypes;
    }
    return newComponent;
  }

  /**
   * // 界面配置
   * sceneOption = {
   *  // 路由配置
   *  route: {
   *    title,
   *    path,
   *    value,
   *    disabled
   *  },
   *  // 布局设置
   *  layout: {
   *    cname,
   *    components: [],
   *    props: {
   *    }
   *  },
   *  // 面板设置
   *  layer: {
   *    cname: 'flexGridLayer',
   *    bindings: [String, ...],
   *    components: [
   *      {cname: String, props: Object, bindings: [], vector}
   *    ],
   *    props: {
   *    }
   *  }
   * }
   */
  getLayer(opt, getState) {
    const promise = opt.then ? opt : Promise.resolve(opt);
    return Promise.all([promise, this._promise]).then(([opt]) => {
      const nextState = getState && getState();
      if (isEqualWith(nextState, opt._prevState, this.customizer) && opt._children) {
        return opt._children;
      } else {
        opt._prevState = nextState;
        return opt._children = this.getViewComponent(opt, opt._prevState);
      }
    });
  }

  customizer = (objValue, othValue) => {
    if (Array.isArray(objValue)) {
      return !objValue.some((item, index) => {
        return !isEqual(item, othValue[index]);
      });
    } else {
      return isEqual(objValue, othValue);
    }
  }

  getViewComponent(opt, state) {
    const ViewComponent = this.parseComponent(opt, state).component;
    // 默认加入app服务
    // LayerComponent.childContextTypes = LayerComponent.childContextTypes || {};
    // LayerComponent.childContextTypes.layer = PropTypes.object;

    if (opt.layout) {
      ViewComponent.routeOptions = this.parseRoute(opt.layout, ViewComponent.routeOptions);
    }
    return ViewComponent;
  }

  renderLayer(Layer, customLayouts) {
    /* eslint-disable */
    const viewComponent = (<Layer />);
    if (Layer.routeOptions && Layer.routeOptions.layout) {
      return getLayout({
        layoutOption: Layer.routeOptions.layoutOption,
        layout: Layer.routeOptions.layout
      }, viewComponent, customLayouts);
    } else {
      return viewComponent;
    }
  }

  render(opt, getState) {
    if (opt.then || opt.layer || opt.cname) {
      return this.context.app.observer(this.getLayer(opt, getState)).render(this.renderLayer);
    } else {
      return (<div className="hc-spin-container">
        <Empty />
      </div>);
    }
  }

  enhanceComponent(com, state) {
    // ! 设计变更，由函数变为对象
    if (state) {
      if (com.getProps) {
        if (!com.getProps._overrided) {
          const getProps = com.getProps;
          com.getProps = (props, context, setState, istate) => {
            if (typeof state === 'function') {
              state = state();
            }
            return Object.assign(getProps(props, context, setState, istate), state);
          }
          com.getProps._overrided = true;;
        }
      } else if (com.props) {
        if (typeof state === 'function') {
          state = state();
        }
        Object.assign(com.props, state);
      } else {
        com.props = state;
      }
    }
    return com;
  }

  parseLayer(components, props = {}, layerGrid, layerItem, state) {
    const layerProps = cloneDeep(props);
    // TODO LayerItem提供了拖拽功能
    layerProps.LayerGrid = layerGrid && findComponent(layerGrid) || LayerGrid;
    layerProps.LayerItem = layerItem && findComponent(layerItem) || LayerItem;
    layerProps.components = [];

    if (components) {
      let index = 0;
      forEach(components, (com, key) => {
        const subState = Array.isArray(state) ? state[index ++] : state;
        com = this.enhanceComponent(com, subState);
        const newCom = this.parseComponent(com, subState);
        layerProps.components.push(newCom);
      });
    }
    return layerProps;
  }

  parseRoute(layout, routeOptions = {}) {
    const layouts = [];
    if (layout.containerLayout) {
      if (Object(layout.containerLayout) === layout.containerLayout) {
        layouts.push(findComponent(layout.containerLayout, null, 'layouts'));
      } else {
        layouts.push(layout.containerLayout);
      }
    }
    layouts.push(findComponent(layout, null, 'layouts'));

    routeOptions.layout = layouts;

    routeOptions.layoutOption = layout.option;
    if (routeOptions.layoutOption.components) {
      const newComponents = {};
      forEach(routeOptions.layoutOption.components, (com, key) => {
        if (typeof key === 'number') {
          key = com.key || com.cname;
        }
        newComponents[key] = this.parseComponent(com);
      });
      routeOptions.layoutOption.components = newComponents;
    }

    return routeOptions;
  }

  createLayerRoutes(scenes) {
    const layerRoutes = [];
    forEach(scenes, (sceneOption) => {
      const route = Object.assign({}, sceneOption.route, {
        // sceneOption: sceneOption,
        getComponent: (nextState, callback) => {
          this.getLayer(sceneOption).then(component => {
            Object.assign(route, component.routeOptions);
            callback(null, component);
          }, callback);
        }
      });
      layerRoutes.push(route);
    });
    return layerRoutes;
  }
}
