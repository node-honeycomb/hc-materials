import merge from 'lodash/merge';
// see: http://gitlab.alibaba-inc.com/openad/oa-ui/issues/57723
import React from 'react';
import PropTypes from 'prop-types';

function safeMerge(o, b) {
  for (let key in b) {
    if (o.hasOwnProperty(key)) {
      window.console.warn('存在相同属性，即将被覆盖');
    }
    o[key] = b[key];
  }
  return o;
}

function getParameters(pm, state) {
  const params = {};

  if (pm) {
    pm.forEach(m => {
      params[m.name] = state[m.name] || m.value;
    });
  }

  return params;
}

function getDataByStructure(ret, structure, fields) {
  const asyncProps = {};
  const collections = [];
  let dataSource = ret;
  if (dataSource) {
    if (!Array.isArray(dataSource)) {
      dataSource = [dataSource];
    }
  } else {
    dataSource = [];
  }
  for (let key in structure) {
    let field = structure[key];
    // value: 'series[0].data
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

    let data = [];
    if (field.noLoop) {
      // dataFilter还有这个用处
      const _dataFilter = converter.parse(field.dataFilter);
      if (_dataFilter) {
        data = _dataFilter(ret, fields);
      } else {
        data = field.data || ret;
      }
    }

    if (field.groupBy) {
      const map = {};
      let index = 0;
      dataSource.forEach(item => {
        if (!map[item[field.groupBy]]) {
          collections.push({
            field: Object.assign({}, field, {propName: field.propName.replace('${x}', index++)}),
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
  }
  dataSource.forEach((item, index) => {
    collections.forEach(map => {
      if (map.field.noLoop) return;

      const value = item[map.field.dataIndex];
      const _dataFilter = converter.parse(map.field.dataFilter);
      let newItem = item;
      if (_dataFilter) {
        newItem = _dataFilter(item, dataSource, fields, index);
      } else if (map.field.dataIndex) {
        newItem = value;
      }
      const flag = map.field.groupBy ? item[map.field.groupBy] !== undefined : true;
      if (flag) {
        if (map.field.district) {
          map.dataMap[value] = newItem;
        } else {
          map.data.push(newItem);
        }
      }
    });
  });

  collections.forEach(col => {
    let key = col.field.propName;
    const ks = key.split('.');
    const last = ks.length - 1;
    let prop = asyncProps;
    let lastProp;

    ks.forEach((tmp, index) => {
      // xxx[x]
      if (tmp[tmp.length - 1] === ']') {
        const pos = tmp.indexOf('[');
        const num = tmp.slice(pos + 1, -1);
        const name = tmp.substr(0, pos);
        prop = prop[name] = prop[name] || [];

        // xxx[x].xx
        if (index < last) {
          if (num) {
            prop = prop[num] = {};
          } else {
            const tmp = {};
            prop.push(tmp);
            prop = tmp;
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
    let data;
    if (col.field.district) {
      data = [];
      for (let k in col.dataMap) {
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
    ret = dataFilter(ret, fields);
    // 通过结构返回
  } else if (structure) {
    ret = getDataByStructure(ret, structure, fields);
    // 通过赋值属性返回
  }
  if (dataPropName) {
    return {
      [dataPropName]: ret
    };
  } else {
    return ret || {};
  }
}

function bindStateObserver(Com, props, pm, stateObserver) {
  if (pm || stateObserver) {
    let routeHelper;
    stateObserver = stateObserver ? [].concat(stateObserver) : [];
    stateObserver.forEach(({trigger, getValueFromEvent}) => {
      props[trigger] = (...args) => {
        getValueFromEvent = converter.parse(getValueFromEvent);
        const obj = getValueFromEvent ? getValueFromEvent.apply(undefined, args) : args[0];
        routeHelper && routeHelper.setState(obj);
      };
    });
    class newCom extends Com {
      static contextTypes = {
        routeHelper: PropTypes.object
      }
      constructor(props, context) {
        super(props, context);
        routeHelper = context.routeHelper;
      }
      componentDidMount() {
        super.componentDidMount && super.componentDidMount();
        if (pm) {
          this.__watcher = (nextState, prevState) => {
            let hasChange = false;
            let mastChange = true;
            pm.forEach(item => {
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
          this.context.routeHelper.watch(this.__watcher, (nextState) => {
            if (this && this.handleResolve) {
              this.handleResolve(nextState);
            }
          });
        }
      }
      componentWillUnmount() {
        super.componentWillUnmount && super.componentWillUnmount();
        this.context.routeHelper.unwatch(this.__watcher);
      }
    }

    return newCom;
  } else {
    return Com;
  }
}

function setFields(fields, elements, context) {
  const newFields = [];
  fields.forEach(item => {
    const _dataFilter = converter.parse(item.dataFilter);
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

const defaultLayerOptoin = {cname: 'SimpleLayer', componentType: 'custom'};

function formatLayerLoop(modules, layerOption, widgetsOption, dataQuery) {
  if (!layerOption) {
    return null;
  }
  const widgets = [];
  const widgetsMap = {};
  widgetsOption = widgetsOption || modules;
  widgetsOption.forEach((item, index) => {
    if (typeof item === 'string') {
      widgetsMap[item] = {orderIndex: index, option: {}};
    } else {
      widgetsMap[item.name] = {orderIndex: index, option: item};
    }
  });
  modules.forEach((mod) => {
    if (!mod.name || !widgetsMap[mod.name]) {
      return;
    }
    const orderIndex = widgetsMap[mod.name].orderIndex;
    const {layer, layout, blocks, elements, attrs, props} = widgetsMap[mod.name].option;
    const {name, pt, pm} = mod;
    const ds = mod.ds || {};

    let widget;
    // 容器
    if (pt.blocks) {
      widget = {
        layout: layout,
        layer: formatLayerLoop(pt.blocks, layer || defaultLayerOptoin, blocks, dataQuery)
      };
    } else {
      // 组件
      const fields = pt.fields;
      const {fieldPropName, dataPropName, structure, component, stateObserver} = pt.dataset;
      const dataFilter = converter.parse(pt.dataset.dataFilter);

      widget = component || {};
      widget.key = widget.key || name;
      widget.contextTypes = widget.contextTypes || [];

      const map = {};
      widget.contextTypes.forEach(t => map[t] = t);
      ['app', 'layer', 'hocCreator', 'routeHelper'].forEach(service => {
        if (map[service] === undefined) {
          widget.contextTypes.push(service);
        }
      });


      if (!ds.data && (ds.api || pm || stateObserver)) {
        // 动态组件
        widget.getComponent = (context, callback) => {
          const hasReady = widget.contextTypes.every(name => context[name]);
          if (hasReady) {
            const Com = context.layer.findComponent(widget.cname, widget.componentType);
            // 封装成Hoc组件，动态获取数据
            const asyncProps = Object.assign({}, props);
            if (!asyncProps[fieldPropName] && fieldPropName && fields) {
              // 静态字段结构
              asyncProps[fieldPropName] = setFields(fields, elements, context);
            }

            if (ds.api) {
              const RichCom = context.hocCreator.getRichComponent(Com, {
                getResolver: (state) => {
                  state = state || context.routeHelper.state;
                  // 发起请求
                  return context.app.ajax[ds.method || 'post'](ds.api, Object.assign({
                    structure: ds.structure,
                    statement: ds.statement,
                    parameters: getParameters(pm, state)
                  }, dataQuery)).then(ret => {
                    return dataRender(ret, structure, fields, dataFilter, dataPropName);
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
            callback(null, () => (<div />));
          }
        };
      } else {
        const getProps = converter.parse(widget.getProps);
        widget.getProps = (props, context) => {
          const syncProps = getProps ? getProps(props, context) : {};
          Object.assign(syncProps, dataRender(ds.data, structure, fields, dataFilter, dataPropName));
          // 静态组件
          if (!syncProps[fieldPropName] && fieldPropName && fields) {
            // 静态字段结构
            // TODO layer
            syncProps[fieldPropName] = setFields(fields, elements, context);
          }

          return syncProps;
        };

        widget.props = merge(widget.props || {}, props);
      }
    }

    // 把skeleton的属性和定位信息合并进来
    widget.attrs = merge(widget.attrs || {}, attrs);
    // 是否有title
    if (pt.hasTitle) {
      if (pt.title) {
        widget.attrs.title = pt.title;
      } else {
        window.console.warn('title不能为空');
      }
    }

    widgets[orderIndex] = widget;
  });
  return Object.assign(layerOption, {
    // 组件处理
    components: widgets
  });
}


export const converter = {
  transform: (code) => code,
  stringify: (obj) => {
    try {
      if (Object(obj) === obj) {
        return JSON.stringify(obj, (k, v) => {
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
  parse: (obj) => {
    try {
      if (typeof obj === 'function') {
        return obj;
      } else if (Object(obj) === obj) {
        return JSON.parse(obj, (k, v) => {
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

export function formatLayer(pageSetting, dataQuery) {
  try {
    const {blocks, skeleton} = Object(pageSetting) === pageSetting ? pageSetting : JSON.parse(pageSetting);
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
