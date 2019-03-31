"use strict";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var prop_types_1 = require("prop-types");

var cloneDeep_1 = require("lodash/cloneDeep");

var forEach_1 = require("lodash/forEach");

var beatle_1 = require("beatle");

var layerConvertor_1 = require("./layerConvertor");

var layerEditor_1 = require("./layerEditor");

var galleryResolver_1 = require("./galleryResolver");

var getCombox_1 = require("./getCombox");

var getComponent_1 = require("../layouts/getComponent");

var layouts_1 = require("../layouts");

var empty_1 = require("antd/lib/empty");

var Layer =
/** @class */
function () {
  function Layer(context, callback) {
    // -----------------------------
    this.findComponent = galleryResolver_1.findComponent;
    this.context = context;
    this._promise = new Promise(function (resolve) {
      Layer.resolveGallery(function (gallery) {
        gallery && galleryResolver_1.setGallery(gallery);
        resolve(true);
        callback && callback();
      });
    });
    this._editable = false;
    this._activeFuns = [];
    this._watcherFns = [];
    this.state = {}; // TODO Object to immutable

    this._state = Object(this.state);
  }

  Layer.prototype.ready = function (callback) {
    this._promise.then(callback);
  };

  Layer.prototype.setState = function (nextState) {
    var prevState = this.state;
    this.state = _extends({}, prevState, nextState);
    this._state = Object(this.state);

    this._watcherFns.forEach(function (fn) {
      fn.watcher(nextState, prevState);
    });
  };

  Layer.prototype.watch = function (watcher, callback) {
    var name = typeof watcher === 'function' ? null : watcher;

    if (name) {
      watcher = function watcher(nextState, prevStore) {
        if (nextState[fnOpt.name] !== prevStore[fnOpt.name]) {
          fnOpt.resolve(nextState);
          fnOpt.resolved = false;
          fnOpt.promise = new Promise(function (resolve) {
            fnOpt.resolve = resolve;
          }).then(function (ret) {
            return fnOpt.callback && fnOpt.callback(ret);
          });
        }
      };
    }

    var fnOpt = this._watcherFns.find(function (fn) {
      return fn.name === name || fn.watch === watcher;
    });

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
      fnOpt.promise = new Promise(function (resolve) {
        fnOpt.resolve = resolve;
      }).then(function (ret) {
        return fnOpt.callback && fnOpt.callback(ret);
      });
    }

    return fnOpt.promise;
  };

  Layer.prototype.unwatch = function (watcher) {
    var idx = this._watcherFns.findIndex(function (fn) {
      return fn.name === watcher || fn.watch === watcher;
    });

    if (idx > -1) {
      this._watcherFns.splice(idx, 1);
    }
  }; // -----------------------------


  Layer.prototype.setEditable = function (editable) {
    this._editable = editable;
  };

  Layer.prototype.isEditable = function () {
    return this._editable;
  };

  Layer.prototype.register = function (id, callback) {
    this._activeFuns.push({
      id: id,
      fn: callback,
      active: false
    });
  };

  Layer.prototype.handleActive = function (id) {
    if (this._editable) {
      this._activeFns.forEach(function (afn) {
        afn.active = afn.id === id;
        afn.fn(afn.active);
      });
    }
  };

  Layer.prototype.getComponent = function (component, props, getProps) {
    if (component._async) {
      props = props || {};
    }

    var contextTypes;
    var newComponent;

    if (component.ChildComponent) {
      contextTypes = component.ChildComponent.contextTypes;
      component.ChildComponent = getComponent_1.getComponent(props, getProps)(component.ChildComponent);
      component.ChildComponent.contextTypes = contextTypes;
      newComponent = component;
    } else {
      contextTypes = component.contextTypes;
      newComponent = getComponent_1.getComponent(props, getProps)(component);
      newComponent.contextTypes = contextTypes;
    }

    return newComponent;
  };
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


  Layer.prototype.parseComponent = function (opt, staticProps) {
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
    var newComponent;
    var props = opt.props;
    var getProps = layerConvertor_1.converter.parse(opt.getProps);
    var cname = opt.cname;
    var componentOption = {
      "static": opt["static"],
      attrs: opt.attrs,
      key: opt.key || cname
    };

    if (opt.layer) {
      var layer = opt.layer;
      newComponent = galleryResolver_1.findComponent(layer, true, 'layers');
      var layerProps = this.parseLayer(layer.components, layer.props, layer.grid, layer.item, staticProps);
      newComponent = this.toView(newComponent, layer.view, layerProps, getProps);
    } else {
      var view_1 = opt.view;

      if (Array.isArray(cname)) {
        newComponent = getCombox_1.getCombox(opt, galleryResolver_1.findComponent, function () {
          return view_1 ? newComponent.childContextTypes : newComponent.contextTypes;
        });
        props = view_1 ? {} : null;
        getProps = null;
      } else {
        newComponent = galleryResolver_1.findComponent(opt, true);
      }

      if (newComponent) {
        newComponent = this.toView(newComponent, view_1, props, getProps);
      } else {
        componentOption.props = props;
        componentOption.getProps = getProps;
      }
    }

    componentOption.component = newComponent;
    return componentOption;
  };

  Layer.prototype.toView = function (component, viewOpt, props, getProps) {
    var newComponent = this.getComponent(component, props, getProps);

    if (viewOpt) {
      var providers_1; // const childContextTypes = {};

      if (viewOpt.providers) {
        providers_1 = {}; // 此处可能有问题

        forEach_1["default"](viewOpt.providers, function (provider, name) {
          if (typeof name === 'number') {
            name = provider;
            provider = galleryResolver_1.findService(name);
          }

          if (provider) {
            providers_1[name] = provider;
          } // childContextTypes[name] = PropTypes.object;

        });
      }

      if (viewOpt.selector) {
        var selector = new beatle_1.BaseSelector();

        _extends(selector, viewOpt.selector);

        newComponent = this.context.app.view(selector, newComponent, providers_1, viewOpt.bindings, viewOpt.hookActions, viewOpt.props, viewOpt.getProps);
      } else {
        newComponent = this.context.app.view(newComponent, providers_1, viewOpt.bindings, viewOpt.hookActions, viewOpt.props, viewOpt.getProps);
      } // newComponent.childContextTypes = childContextTypes;

    }

    return newComponent;
  };
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


  Layer.prototype.getLayer = function (opt, staticProps) {
    var _this = this;

    var promise = opt.then ? opt : Promise.resolve(opt);
    return Promise.all([promise, this._promise]).then(function (_a) {
      var opt = _a[0];
      return _this.getViewComponent(opt, staticProps);
    });
  };

  Layer.prototype.getViewComponent = function (opt, staticProps) {
    var ViewComponent = this.parseComponent(opt, staticProps).component; // 默认加入app服务
    // LayerComponent.childContextTypes = LayerComponent.childContextTypes || {};
    // LayerComponent.childContextTypes.layer = PropTypes.object;

    if (opt.layout) {
      ViewComponent.routeOptions = this.parseRoute(opt.layout, ViewComponent.routeOptions);
    }

    return ViewComponent;
  };

  Layer.prototype.renderLayer = function (Layer, customLayouts) {
    /* eslint-disable */
    var viewComponent = React.createElement(Layer, null);

    if (Layer.routeOptions && Layer.routeOptions.layout) {
      return layouts_1.getLayout({
        layoutOption: Layer.routeOptions.layoutOption,
        layout: Layer.routeOptions.layout
      }, viewComponent, customLayouts);
    } else {
      return viewComponent;
    }
  };

  Layer.prototype.render = function (opt, staticProps) {
    if (opt.then || opt.layer) {
      return this.context.app.observer(this.getLayer(opt, staticProps)).render(this.renderLayer);
    } else {
      return React.createElement("div", {
        className: "hc-spin-container"
      }, React.createElement(empty_1["default"], null));
    }
  };

  Layer.prototype.parseLayer = function (components, props, layerGrid, layerItem, staticProps) {
    var _this = this;

    if (props === void 0) {
      props = {};
    }

    if (staticProps === void 0) {
      staticProps = [];
    }

    var layerProps = cloneDeep_1["default"](props); // TODO LayerItem提供了拖拽功能

    layerProps.LayerGrid = layerGrid && galleryResolver_1.findComponent(layerGrid) || layerEditor_1.LayerGrid;
    layerProps.LayerItem = layerItem && galleryResolver_1.findComponent(layerItem) || layerEditor_1.LayerItem;
    layerProps.components = [];

    if (components) {
      forEach_1["default"](components, function (com, key) {
        var extra = staticProps[key] || staticProps[com.key] || staticProps[com.cname]; // 可能不太好！！

        if (extra) {
          if (extra.props) {
            if (com.props) {
              _extends(com.props, extra.props);
            } else {
              com.props = extra.props;
            }
          } else if (extra.getProps) {
            if (com.getProps) {
              var getProps_1 = com.getProps;

              com.getProps = function (props, context) {
                var _props = extra.getProps(props, context);

                return _extends(_props, getProps_1(props, context));
              };
            } else {
              com.getProps = extra.getProps;
            }
          }
        }

        var newCom = _this.parseComponent(com, extra && extra.staticProps);

        layerProps.components.push(newCom);
      });
    }

    return layerProps;
  };

  Layer.prototype.parseRoute = function (layout, routeOptions) {
    var _this = this;

    if (routeOptions === void 0) {
      routeOptions = {};
    }

    var layouts = [];

    if (layout.containerLayout) {
      if (Object(layout.containerLayout) === layout.containerLayout) {
        layouts.push(galleryResolver_1.findComponent(layout.containerLayout, null, 'layouts'));
      } else {
        layouts.push(layout.containerLayout);
      }
    }

    layouts.push(galleryResolver_1.findComponent(layout, null, 'layouts'));
    routeOptions.layout = layouts;
    routeOptions.layoutOption = layout.option;

    if (routeOptions.layoutOption.components) {
      var newComponents_1 = {};
      forEach_1["default"](routeOptions.layoutOption.components, function (com, key) {
        if (typeof key === 'number') {
          key = com.key || com.cname;
        }

        newComponents_1[key] = _this.parseComponent(com);
      });
      routeOptions.layoutOption.components = newComponents_1;
    }

    return routeOptions;
  };

  Layer.prototype.createLayerRoutes = function (scenes) {
    var _this = this;

    var layerRoutes = [];
    forEach_1["default"](scenes, function (sceneOption) {
      var route = _extends({}, sceneOption.route, {
        // sceneOption: sceneOption,
        getComponent: function getComponent(nextState, callback) {
          _this.getLayer(sceneOption).then(function (component) {
            _extends(route, component.routeOptions);

            callback(null, component);
          }, callback);
        }
      });

      layerRoutes.push(route);
    });
    return layerRoutes;
  };

  Layer.resolveGallery = function (callback) {
    return callback({});
  };

  Layer.contextTypes = {
    app: prop_types_1["default"].object
  };
  return Layer;
}();

exports.Layer = Layer;