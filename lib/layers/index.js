"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Layer = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));

var _forEach = _interopRequireDefault(require("lodash/forEach"));

var _isEqual = _interopRequireDefault(require("lodash/isEqual"));

var _isEqualWith = _interopRequireDefault(require("lodash/isEqualWith"));

var _beatle = require("beatle");

var _layerConvertor = require("./layerConvertor");

var _layerEditor = require("./layerEditor");

var _galleryResolver = require("./galleryResolver");

var _getCombox = require("./getCombox");

var _getComponent2 = require("../layouts/getComponent");

var _layouts = require("../layouts");

var _antd = require("antd");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Layer =
/*#__PURE__*/
function () {
  function Layer(context, callback) {
    _classCallCheck(this, Layer);

    // -----------------------------
    this.findComponent = _galleryResolver.findComponent;

    this.customizer = function (objValue, othValue) {
      if (Array.isArray(objValue)) {
        if (Array.isArray(othValue)) {
          return !objValue.some(function (item, index) {
            return !(0, _isEqual["default"])(item, othValue[index]);
          });
        } else {
          return false;
        }
      } else {
        return (0, _isEqual["default"])(objValue, othValue);
      }
    };

    this.context = context;
    this._promise = new Promise(function (resolve) {
      Layer.resolveGallery(function (gallery) {
        gallery && (0, _galleryResolver.setGallery)(gallery);
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

  _createClass(Layer, [{
    key: "ready",
    value: function ready(callback) {
      this._promise.then(callback);
    }
  }, {
    key: "setState",
    value: function setState(nextState) {
      var prevState = this.state;
      this.state = _extends({}, prevState, nextState);
      this._state = Object(this.state);

      this._watcherFns.forEach(function (fn) {
        fn.watcher(nextState, prevState);
      });
    }
  }, {
    key: "watch",
    value: function watch(watcher, callback) {
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
    }
  }, {
    key: "unwatch",
    value: function unwatch(watcher) {
      var idx = this._watcherFns.findIndex(function (fn) {
        return fn.name === watcher || fn.watch === watcher;
      });

      if (idx > -1) {
        this._watcherFns.splice(idx, 1);
      }
    } // -----------------------------

  }, {
    key: "setEditable",
    value: function setEditable(editable) {
      this._editable = editable;
    }
  }, {
    key: "isEditable",
    value: function isEditable() {
      return this._editable;
    }
  }, {
    key: "register",
    value: function register(id, callback) {
      this._activeFuns.push({
        id: id,
        fn: callback,
        active: false
      });
    }
  }, {
    key: "handleActive",
    value: function handleActive(id) {
      if (this._editable) {
        this._activeFns.forEach(function (afn) {
          afn.active = afn.id === id;
          afn.fn(afn.active);
        });
      }
    }
  }, {
    key: "getComponent",
    value: function getComponent(component, props, getProps) {
      if (component._async) {
        props = props || {};
      }

      var contextTypes;
      var newComponent;

      if (component.ChildComponent) {
        contextTypes = component.ChildComponent.contextTypes;
        component.ChildComponent = (0, _getComponent2.getComponent)(props, getProps)(component.ChildComponent);
        component.ChildComponent.contextTypes = contextTypes;
        newComponent = component;
      } else {
        contextTypes = component.contextTypes;
        newComponent = (0, _getComponent2.getComponent)(props, getProps)(component);
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

  }, {
    key: "parseComponent",
    value: function parseComponent(opt, state) {
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

      var getProps = _layerConvertor.converter.parse(opt.getProps);

      var cname = opt.cname;
      var componentOption = {
        "static": opt["static"],
        attrs: opt.attrs,
        key: opt.key || cname
      };

      if (opt.layer) {
        var layer = opt.layer;
        newComponent = (0, _galleryResolver.findComponent)(layer, true, 'layers');
        var layerProps = this.parseLayer(layer.components, layer.props, layer.grid, layer.item, state);
        newComponent = this.toView(newComponent, layer.view, layerProps, getProps);
      } else {
        var view = opt.view;
        opt = this.enhanceComponent(opt, state);

        if (Array.isArray(cname)) {
          newComponent = (0, _getCombox.getCombox)(opt, _galleryResolver.findComponent, function () {
            return view ? newComponent.childContextTypes : newComponent.contextTypes;
          });
          props = view ? {} : null;
          getProps = null;
        } else {
          newComponent = (0, _galleryResolver.findComponent)(opt, true);
        }

        if (newComponent) {
          newComponent = this.toView(newComponent, view, props, getProps);
        } else {
          componentOption.props = props;
          componentOption.getProps = getProps;

          if (opt.contextTypes) {
            if (Array.isArray(opt.contextTypes)) {
              componentOption.contextTypes = {};
              opt.contextTypes.forEach(function (name) {
                componentOption.contextTypes[name] = _propTypes["default"].object;
              });
            } else {
              componentOption.contextTypes = opt.contextTypes;
            }
          }
        }
      }

      componentOption.component = newComponent;
      return componentOption;
    }
  }, {
    key: "toView",
    value: function toView(component, viewOpt, props, getProps) {
      var newComponent = this.getComponent(component, props, getProps);

      if (viewOpt) {
        var providers; // const childContextTypes = {};

        if (viewOpt.providers) {
          providers = {}; // 此处可能有问题

          (0, _forEach["default"])(viewOpt.providers, function (provider, name) {
            if (typeof name === 'number') {
              name = provider;
              provider = (0, _galleryResolver.findService)(name);
            }

            if (provider) {
              providers[name] = provider;
            } // childContextTypes[name] = PropTypes.object;

          });
        }

        if (viewOpt.selector) {
          var selector = new _beatle.BaseSelector();

          _extends(selector, viewOpt.selector);

          newComponent = this.context.app.view(selector, newComponent, providers, viewOpt.bindings, viewOpt.hookActions, viewOpt.props, viewOpt.getProps);
        } else {
          newComponent = this.context.app.view(newComponent, providers, viewOpt.bindings, viewOpt.hookActions, viewOpt.props, viewOpt.getProps);
        } // newComponent.childContextTypes = childContextTypes;

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

  }, {
    key: "getLayer",
    value: function getLayer(opt, getState) {
      var _this = this;

      var promise = opt.then ? opt : Promise.resolve(opt);
      return Promise.all([promise, this._promise]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            opt = _ref2[0];

        var nextState = typeof getState === 'function' ? getState() : getState;

        if ((0, _isEqualWith["default"])(nextState, opt._prevState, _this.customizer) && opt._children) {
          return opt._children;
        } else {
          opt._prevState = nextState;
          return opt._children = _this.getViewComponent(opt, opt._prevState);
        }
      });
    }
  }, {
    key: "getViewComponent",
    value: function getViewComponent(opt, state) {
      var ViewComponent = this.parseComponent(opt, state).component; // 默认加入app服务
      // LayerComponent.childContextTypes = LayerComponent.childContextTypes || {};
      // LayerComponent.childContextTypes.layer = PropTypes.object;

      if (opt.layout) {
        ViewComponent.routeOptions = this.parseRoute(opt.layout, ViewComponent.routeOptions);
      }

      return ViewComponent;
    }
  }, {
    key: "renderLayer",
    value: function renderLayer(Layer, customLayouts) {
      /* eslint-disable */
      var viewComponent = _react["default"].createElement(Layer, null);

      if (Layer.routeOptions && Layer.routeOptions.layout) {
        return (0, _layouts.getLayout)({
          layoutOption: Layer.routeOptions.layoutOption,
          layout: Layer.routeOptions.layout
        }, viewComponent, customLayouts);
      } else {
        return viewComponent;
      }
    }
  }, {
    key: "render",
    value: function render(opt, getState) {
      if (opt.then || opt.layer || opt.cname) {
        return this.context.app.observer(this.getLayer(opt, getState)).render(this.renderLayer);
      } else {
        return _react["default"].createElement("div", {
          className: "hc-spin-container"
        }, _react["default"].createElement(_antd.Empty, null));
      }
    }
  }, {
    key: "enhanceComponent",
    value: function enhanceComponent(com, state) {
      // ! 设计变更，由函数变为对象
      if (state) {
        if (com.getProps) {
          if (!com.getProps._overrided) {
            var getProps = com.getProps;

            com.getProps = function (props, context, setState, istate) {
              if (typeof state === 'function') {
                state = state();
              }

              return _extends(getProps(props, context, setState, istate), state);
            };

            com.getProps._overrided = true;
            ;
          }
        } else {
          if (typeof state === 'function') {
            com.getProps = state;
            com.getProps._overrided = true;
          } else {
            com.props = _extends(com.props || {}, state);
          }
        }
      }

      return com;
    }
  }, {
    key: "parseLayer",
    value: function parseLayer(components) {
      var _this2 = this;

      var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var layerGrid = arguments.length > 2 ? arguments[2] : undefined;
      var layerItem = arguments.length > 3 ? arguments[3] : undefined;
      var state = arguments.length > 4 ? arguments[4] : undefined;
      var layerProps = (0, _cloneDeep["default"])(props); // TODO LayerItem提供了拖拽功能

      layerProps.LayerGrid = layerGrid && (0, _galleryResolver.findComponent)(layerGrid) || _layerEditor.LayerGrid;
      layerProps.LayerItem = layerItem && (0, _galleryResolver.findComponent)(layerItem) || _layerEditor.LayerItem;
      layerProps.components = [];

      if (components) {
        var index = 0;
        (0, _forEach["default"])(components, function (com, key) {
          var subState = Array.isArray(state) ? state[index++] : state;
          com = _this2.enhanceComponent(com, subState);

          var newCom = _this2.parseComponent(com, subState);

          layerProps.components.push(newCom);
        });
      }

      return layerProps;
    }
  }, {
    key: "parseRoute",
    value: function parseRoute(layout) {
      var _this3 = this;

      var routeOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var layouts = [];

      if (layout.containerLayout) {
        if (Object(layout.containerLayout) === layout.containerLayout) {
          layouts.push((0, _galleryResolver.findComponent)(layout.containerLayout, null, 'layouts'));
        } else {
          layouts.push(layout.containerLayout);
        }
      }

      layouts.push((0, _galleryResolver.findComponent)(layout, null, 'layouts'));
      routeOptions.layout = layouts;
      routeOptions.layoutOption = layout.option;

      if (routeOptions.layoutOption.components) {
        var newComponents = {};
        (0, _forEach["default"])(routeOptions.layoutOption.components, function (com, key) {
          if (typeof key === 'number') {
            key = com.key || com.cname;
          }

          newComponents[key] = _this3.parseComponent(com);
        });
        routeOptions.layoutOption.components = newComponents;
      }

      return routeOptions;
    }
  }, {
    key: "createLayerRoutes",
    value: function createLayerRoutes(scenes) {
      var _this4 = this;

      var layerRoutes = [];
      (0, _forEach["default"])(scenes, function (sceneOption) {
        var route = _extends({}, sceneOption.route, {
          // sceneOption: sceneOption,
          getComponent: function getComponent(nextState, callback) {
            _this4.getLayer(sceneOption).then(function (component) {
              _extends(route, component.routeOptions);

              callback(null, component);
            }, callback);
          }
        });

        layerRoutes.push(route);
      });
      return layerRoutes;
    }
  }]);

  return Layer;
}();

exports.Layer = Layer;

Layer.resolveGallery = function (callback) {
  return callback({});
};

Layer.contextTypes = {
  app: _propTypes["default"].object
};