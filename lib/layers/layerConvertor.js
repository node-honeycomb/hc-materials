"use strict";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var merge_1 = require("lodash/merge"); // see: http://gitlab.alibaba-inc.com/openad/oa-ui/issues/57723


var react_1 = require("react");

var prop_types_1 = require("prop-types");

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

  var _loop_1 = function _loop_1(key) {
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
      var _dataFilter = exports.converter.parse(field.dataFilter);

      if (_dataFilter) {
        data = _dataFilter(ret, fields);
      } else {
        data = field.data || ret;
      }
    }

    if (field.groupBy) {
      var map_1 = {};
      var index_1 = 0;
      dataSource.forEach(function (item) {
        if (!map_1[item[field.groupBy]]) {
          collections.push({
            field: _extends({}, field, {
              propName: field.propName.replace('${x}', index_1++)
            }),
            data: field.noLoop ? data : [],
            dataMap: {}
          });
        }

        map_1[item[field.groupBy]] = true;
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
    _loop_1(key);
  }

  dataSource.forEach(function (item, index) {
    collections.forEach(function (map) {
      if (map.field.noLoop) return;
      var value = item[map.field.dataIndex];

      var _dataFilter = exports.converter.parse(map.field.dataFilter);

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
        var name_1 = tmp.substr(0, pos);
        prop = prop[name_1] = prop[name_1] || []; // xxx[x].xx

        if (index < last) {
          if (num) {
            prop = prop[num] = {};
          } else {
            var tmp_1 = {};
            prop.push(tmp_1);
            prop = tmp_1;
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
  var _a; // 通过数据处理器返回


  if (dataFilter) {
    ret = dataFilter(ret, fields); // 通过结构返回
  } else if (structure) {
    ret = getDataByStructure(ret, structure, fields); // 通过赋值属性返回
  }

  if (dataPropName) {
    return _a = {}, _a[dataPropName] = ret, _a;
  } else {
    return ret || {};
  }
}

function bindStateObserver(Com, props, pm, stateObserver) {
  if (pm || stateObserver) {
    var routeHelper_1;
    stateObserver = stateObserver ? [].concat(stateObserver) : [];
    stateObserver.forEach(function (_a) {
      var trigger = _a.trigger,
          getValueFromEvent = _a.getValueFromEvent;

      props[trigger] = function () {
        var args = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }

        getValueFromEvent = exports.converter.parse(getValueFromEvent);
        var obj = getValueFromEvent ? getValueFromEvent.apply(undefined, args) : args[0];
        routeHelper_1 && routeHelper_1.setState(obj);
      };
    });

    var newCom =
    /** @class */
    function (_super) {
      __extends(newCom, _super);

      function newCom(props, context) {
        var _this = _super.call(this, props, context) || this;

        routeHelper_1 = context.routeHelper;
        return _this;
      }

      newCom.prototype.componentDidMount = function () {
        var _this = this;

        _super.prototype.componentDidMount && _super.prototype.componentDidMount.call(this);

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
            if (_this && _this.handleResolve) {
              _this.handleResolve(nextState);
            }
          });
        }
      };

      newCom.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount && _super.prototype.componentWillUnmount.call(this);
        this.context.routeHelper.unwatch(this.__watcher);
      };

      newCom.contextTypes = {
        routeHelper: prop_types_1["default"].object
      };
      return newCom;
    }(Com);

    return newCom;
  } else {
    return Com;
  }
}

function setFields(fields, elements, context) {
  var newFields = [];
  fields.forEach(function (item) {
    var _dataFilter = exports.converter.parse(item.dataFilter);

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
    var _a = widgetsMap[mod.name].option,
        layer = _a.layer,
        layout = _a.layout,
        blocks = _a.blocks,
        elements = _a.elements,
        attrs = _a.attrs,
        props = _a.props;
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
      var fields_1 = pt.fields;
      var _b = pt.dataset,
          fieldPropName_1 = _b.fieldPropName,
          dataPropName_1 = _b.dataPropName,
          structure_1 = _b.structure,
          component = _b.component,
          stateObserver_1 = _b.stateObserver;
      var dataFilter_1 = exports.converter.parse(pt.dataset.dataFilter);
      widget = component || {};
      widget.key = widget.key || name;
      widget.contextTypes = widget.contextTypes || [];
      var map_2 = {};
      widget.contextTypes.forEach(function (t) {
        return map_2[t] = t;
      });
      ['app', 'layer', 'hocCreator', 'routeHelper'].forEach(function (service) {
        if (map_2[service] === undefined) {
          widget.contextTypes.push(service);
        }
      });

      if (!ds.data && (ds.api || pm || stateObserver_1)) {
        // 动态组件
        widget.getComponent = function (context, callback) {
          var hasReady = widget.contextTypes.every(function (name) {
            return context[name];
          });

          if (hasReady) {
            var Com = context.layer.findComponent(widget.cname, widget.componentType); // 封装成Hoc组件，动态获取数据

            var asyncProps = _extends({}, props);

            if (!asyncProps[fieldPropName_1] && fieldPropName_1 && fields_1) {
              // 静态字段结构
              asyncProps[fieldPropName_1] = setFields(fields_1, elements, context);
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
                    return dataRender(ret, structure_1, fields_1, dataFilter_1, dataPropName_1);
                  });
                },
                childProps: asyncProps
              });
              callback(null, bindStateObserver(RichCom, asyncProps, pm, stateObserver_1));
            } else {
              callback(null, bindStateObserver(Com, asyncProps, pm, stateObserver_1), asyncProps);
            }
          } else {
            window.console.warn('服务丢失：' + widget.contextTypes.join(', '));
            callback(null, function () {
              return React.createElement("div", null);
            });
          }
        };
      } else {
        var getProps_1 = exports.converter.parse(widget.getProps);

        widget.getProps = function (props, context) {
          var syncProps = getProps_1 ? getProps_1(props, context) : {};

          _extends(syncProps, dataRender(ds.data, structure_1, fields_1, dataFilter_1, dataPropName_1)); // 静态组件


          if (!syncProps[fieldPropName_1] && fieldPropName_1 && fields_1) {
            // 静态字段结构
            // TODO layer
            syncProps[fieldPropName_1] = setFields(fields_1, elements, context);
          }

          return syncProps;
        };

        widget.props = merge_1["default"](widget.props || {}, props);
      }
    } // 把skeleton的属性和定位信息合并进来


    widget.attrs = merge_1["default"](widget.attrs || {}, attrs); // 是否有title

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

exports.converter = {
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
  }
};

function formatLayer(pageSetting, dataQuery) {
  try {
    var _a = Object(pageSetting) === pageSetting ? pageSetting : JSON.parse(pageSetting),
        blocks = _a.blocks,
        skeleton = _a.skeleton;

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

exports.formatLayer = formatLayer;