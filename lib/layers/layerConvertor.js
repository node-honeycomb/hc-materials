"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatLayer = formatLayer;
exports.converter = void 0;

var _merge = _interopRequireDefault(require("lodash/merge"));

var _react = _interopRequireDefault(require("react"));

var _defer = require("../core/defer");

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function safeMerge(o, b) {
  for (var key in b) {
    if (o.hasOwnProperty(key)) {
      window.console.warn('存在相同属性，即将被覆盖');
    }

    o[key] = b[key];
  }

  return o;
}

function getParameters(pm, state) {
  var params = {};

  if (pm) {
    pm.forEach(function (m) {
      params[m.name] = state[m.name] || m.value;
    });
  }

  return params;
}

function getDataByStructure(ret, structure, fields) {
  var asyncProps = {};
  var collections = [];
  var dataSource = ret;

  if (dataSource) {
    if (!Array.isArray(dataSource)) {
      dataSource = [dataSource];
    }
  } else {
    dataSource = [];
  }

  var _loop = function _loop(key) {
    var field = structure[key]; // value: 'series[0].data

    if (typeof field === 'string') {
      field = {
        propName: field
      };
    }
    /**
     * field = {
     *  dataIndex,
     *  propName,
     *  // 只在对象时有效
     *  extend,
     *  data,
     *  district,
     *  groupBy,
     *  noLoop
     * }
     */


    field.dataIndex = field.dataIndex || key;
    field.propName = field.propName || key;
    var data = [];

    if (field.noLoop) {
      // dataFilter还有这个用处
      var _dataFilter = converter.parse(field.dataFilter);

      if (_dataFilter) {
        data = _dataFilter(ret, fields);
      } else {
        data = field.data || ret;
      }
    }

    if (field.groupBy) {
      var map = {};
      var index = 0;
      dataSource.forEach(function (item) {
        if (!map[item[field.groupBy]]) {
          collections.push({
            field: _extends({}, field, {
              propName: field.propName.replace('${x}', index++)
            }),
            data: field.noLoop ? data : [],
            dataMap: {}
          });
        }

        map[item[field.groupBy]] = true;
      });
    } else {
      collections.push({
        field: field,
        data: data,
        dataMap: {}
      });
    }
  };

  for (var key in structure) {
    _loop(key);
  }

  dataSource.forEach(function (item, index) {
    collections.forEach(function (map) {
      if (map.field.noLoop) return;
      var value = item[map.field.dataIndex];

      var _dataFilter = converter.parse(map.field.dataFilter);

      var newItem = item;

      if (_dataFilter) {
        newItem = _dataFilter(item, dataSource, fields, index);
      } else if (map.field.dataIndex) {
        newItem = value;
      }

      var flag = map.field.groupBy ? item[map.field.groupBy] !== undefined : true;

      if (flag) {
        if (map.field.district) {
          map.dataMap[value] = newItem;
        } else {
          map.data.push(newItem);
        }
      }
    });
  });
  collections.forEach(function (col) {
    var key = col.field.propName;
    var ks = key.split('.');
    var last = ks.length - 1;
    var prop = asyncProps;
    var lastProp;
    ks.forEach(function (tmp, index) {
      // xxx[x]
      if (tmp[tmp.length - 1] === ']') {
        var pos = tmp.indexOf('[');
        var num = tmp.slice(pos + 1, -1);
        var name = tmp.substr(0, pos);
        prop = prop[name] = prop[name] || []; // xxx[x].xx

        if (index < last) {
          if (num) {
            prop = prop[num] = {};
          } else {
            var _tmp = {};
            prop.push(_tmp);
            prop = _tmp;
          }
        } else {
          // xxx[x]
          lastProp = prop;
          key = num;
        }
      } else if (index < last) {
        // xxx[x].xx
        prop = prop[tmp] = prop[tmp] || {};
      } else {
        lastProp = prop;
        key = tmp;
      }
    });
    var data;

    if (col.field.district) {
      data = [];

      for (var k in col.dataMap) {
        data.push(col.dataMap[k]);
      }
    } else {
      data = col.data;
    }

    if (Array.isArray(lastProp)) {
      if (key === undefined) {
        lastProp.push(data);
      } else {
        lastProp[key] = data;
      }
    } else {
      lastProp[key] = data;

      if (col.field.extend) {
        safeMerge(lastProp, col.field.extend);
      }
    }
  });
  window.console.log(asyncProps);
  return asyncProps;
}

function dataRender(ret, structure, fields, dataFilter, dataPropName) {
  // 通过数据处理器返回
  if (dataFilter) {
    ret = dataFilter(ret, fields); // 通过结构返回
  } else if (structure) {
    ret = getDataByStructure(ret, structure, fields); // 通过赋值属性返回
  }

  if (dataPropName) {
    return _defineProperty({}, dataPropName, ret);
  } else {
    return ret || {};
  }
}

function bindStateObserver(Com, props, pm, stateObserver) {
  if (pm || stateObserver) {
    var routeHelper;
    stateObserver = stateObserver ? [].concat(stateObserver) : [];
    stateObserver.forEach(function (_ref2) {
      var trigger = _ref2.trigger,
          getValueFromEvent = _ref2.getValueFromEvent;

      props[trigger] = function () {
        getValueFromEvent = converter.parse(getValueFromEvent);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var obj = getValueFromEvent ? getValueFromEvent.apply(undefined, args) : args[0];
        routeHelper && routeHelper.setState(obj);
      };
    });

    var newCom =
    /*#__PURE__*/
    function (_Com) {
      _inherits(newCom, _Com);

      function newCom(props, context) {
        var _this;

        _classCallCheck(this, newCom);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(newCom).call(this, props, context));
        routeHelper = context.routeHelper;
        return _this;
      }

      _createClass(newCom, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          var _this2 = this;

          _get(_getPrototypeOf(newCom.prototype), "componentDidMount", this) && _get(_getPrototypeOf(newCom.prototype), "componentDidMount", this).call(this);

          if (pm) {
            this.__watcher = function (nextState, prevState) {
              var hasChange = false;
              var mastChange = true;
              pm.forEach(function (item) {
                // _ID_ &&
                if (item.name[0] === '_' && item.name[item.name.length - 1] === '_') {
                  mastChange = nextState[item.name] !== prevState[item.name];
                } else {
                  // ||
                  hasChange = hasChange || nextState[item.name] !== prevState[item.name];
                }
              });
              return mastChange && hasChange;
            };

            this.context.routeHelper.watch(this.__watcher, function (nextState) {
              if (_this2 && _this2.handleResolve) {
                _this2.handleResolve(nextState);
              }
            });
          }
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          _get(_getPrototypeOf(newCom.prototype), "componentWillUnmount", this) && _get(_getPrototypeOf(newCom.prototype), "componentWillUnmount", this).call(this);
          this.context.routeHelper.unwatch(this.__watcher);
        }
      }]);

      return newCom;
    }(Com);

    newCom.contextTypes = {
      routeHelper: _propTypes["default"].object
    };
    return newCom;
  } else {
    return Com;
  }
}

function setFields(fields, elements, context) {
  var newFields = [];
  fields.forEach(function (item) {
    var _dataFilter = converter.parse(item.dataFilter);

    if (_dataFilter) {
      item = _dataFilter(item, fields, context);

      if (item.component) {
        item.Component = context.layer.findComponent(item.component);
      }
    }

    newFields.push(safeMerge(item, elements && elements[item.dataIndex]));
  });
  return newFields;
}

var defaultLayerOptoin = {
  cname: 'SimpleLayer',
  componentType: 'custom'
};

function formatLayerLoop(modules, layerOption, widgetsOption, dataQuery) {
  if (!layerOption) {
    return null;
  }

  var widgets = [];
  var widgetsMap = {};
  widgetsOption = widgetsOption || modules;
  widgetsOption.forEach(function (item, index) {
    if (typeof item === 'string') {
      widgetsMap[item] = {
        orderIndex: index,
        option: {}
      };
    } else {
      widgetsMap[item.name] = {
        orderIndex: index,
        option: item
      };
    }
  });
  modules.forEach(function (mod) {
    if (!mod.name || !widgetsMap[mod.name]) {
      return;
    }

    var orderIndex = widgetsMap[mod.name].orderIndex;
    var _widgetsMap$mod$name$ = widgetsMap[mod.name].option,
        layer = _widgetsMap$mod$name$.layer,
        layout = _widgetsMap$mod$name$.layout,
        blocks = _widgetsMap$mod$name$.blocks,
        elements = _widgetsMap$mod$name$.elements,
        attrs = _widgetsMap$mod$name$.attrs,
        props = _widgetsMap$mod$name$.props;
    var name = mod.name,
        pt = mod.pt,
        pm = mod.pm;
    var ds = mod.ds || {};
    var widget; // 容器

    if (pt.blocks) {
      widget = {
        layout: layout,
        layer: formatLayerLoop(pt.blocks, layer || defaultLayerOptoin, blocks, dataQuery)
      };
    } else {
      // 组件
      var fields = pt.fields;
      var _pt$dataset = pt.dataset,
          fieldPropName = _pt$dataset.fieldPropName,
          dataPropName = _pt$dataset.dataPropName,
          structure = _pt$dataset.structure,
          component = _pt$dataset.component,
          stateObserver = _pt$dataset.stateObserver;
      var dataFilter = converter.parse(pt.dataset.dataFilter);
      widget = component || {};
      widget.key = widget.key || name;
      widget.contextTypes = widget.contextTypes || [];
      var map = {};
      widget.contextTypes.forEach(function (t) {
        return map[t] = t;
      });
      ['app', 'layer', 'hocCreator', 'routeHelper'].forEach(function (service) {
        if (map[service] === undefined) {
          widget.contextTypes.push(service);
        }
      });

      if (!ds.data && (ds.api || pm || stateObserver)) {
        // 动态组件
        widget.getComponent = function (context, callback) {
          var hasReady = widget.contextTypes.every(function (name) {
            return context[name];
          });

          if (hasReady) {
            var Com = context.layer.findComponent(widget.cname, widget.componentType); // 封装成Hoc组件，动态获取数据

            var asyncProps = _extends({}, props);

            if (!asyncProps[fieldPropName] && fieldPropName && fields) {
              // 静态字段结构
              asyncProps[fieldPropName] = setFields(fields, elements, context);
            }

            if (ds.api) {
              var RichCom = context.hocCreator.getRichComponent(Com, {
                getResolver: function getResolver(state) {
                  state = state || context.routeHelper.state; // 发起请求

                  return context.app.ajax[ds.method || 'post'](ds.api, _extends({
                    structure: ds.structure,
                    statement: ds.statement,
                    parameters: getParameters(pm, state)
                  }, dataQuery)).then(function (ret) {
                    return dataRender(ret, structure, fields, dataFilter, dataPropName);
                  }, function () {// handler
                  });
                },
                childProps: asyncProps
              });
              callback(null, bindStateObserver(RichCom, asyncProps, pm, stateObserver));
            } else {
              callback(null, bindStateObserver(Com, asyncProps, pm, stateObserver), asyncProps);
            }
          } else {
            window.console.warn('服务丢失：' + widget.contextTypes.join(', '));
            callback(null, function () {
              return _react["default"].createElement("div", null);
            });
          }
        };
      } else {
        var getProps = converter.parse(widget.getProps);

        widget.getProps = function (props, context) {
          var syncProps = getProps ? getProps(props, context) : {};

          _extends(syncProps, dataRender(ds.data, structure, fields, dataFilter, dataPropName)); // 静态组件


          if (!syncProps[fieldPropName] && fieldPropName && fields) {
            // 静态字段结构
            // TODO layer
            syncProps[fieldPropName] = setFields(fields, elements, context);
          }

          return syncProps;
        };

        widget.props = (0, _merge["default"])(widget.props || {}, props);
      }
    } // 把skeleton的属性和定位信息合并进来


    widget.attrs = (0, _merge["default"])(widget.attrs || {}, attrs); // 是否有title

    if (pt.hasTitle) {
      if (pt.title) {
        widget.attrs.title = pt.title;
      } else {
        window.console.warn('title不能为空');
      }
    }

    widgets[orderIndex] = widget;
  });
  return _extends(layerOption, {
    // 组件处理
    components: widgets
  });
}

var defer = new _defer.Deferred();
var converter = {
  $defer: defer,
  transform: function transform(code) {
    return code;
  },
  stringify: function stringify(obj) {
    try {
      if (Object(obj) === obj) {
        return JSON.stringify(obj, function (k, v) {
          if (typeof v === 'function') {
            return v.toString();
          } else {
            return v;
          }
        }, 2);
      } else if (obj) {
        return obj.toString();
      }
    } catch (e) {
      window.console.error(e);
    }
  },
  parse: function parse(obj) {
    try {
      if (typeof obj === 'function') {
        return obj;
      } else if (Object(obj) === obj) {
        return JSON.parse(obj, function (k, v) {
          if (typeof v === 'string' && v.indexOf('function') === 0) {
            return new Function('return ' + obj)();
          } else {
            return v;
          }
        }, 2);
      } else {
        return new Function('return ' + obj)();
      }
    } catch (e) {
      window.console.error(e);
    }
  },
  parseAsync: function parseAsync(obj, callback) {
    return defer.promise.then(function () {
      if (callback) {
        return callback(converter.parse(obj));
      } else {
        return converter.parse(obj);
      }
    });
  }
};
exports.converter = converter;

function formatLayer(pageSetting, dataQuery) {
  try {
    var _ref3 = Object(pageSetting) === pageSetting ? pageSetting : JSON.parse(pageSetting),
        blocks = _ref3.blocks,
        skeleton = _ref3.skeleton;

    if (skeleton && blocks) {
      return {
        layout: skeleton.layout,
        layer: formatLayerLoop(blocks, skeleton.layer, skeleton.blocks, dataQuery)
      };
    } else {
      return {};
    }
  } catch (e) {
    window.console.error(e);
  }

  return {};
}