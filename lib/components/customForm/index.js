"use strict";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = void 0 && (void 0).__metadata || function (k, v) {
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var prop_types_1 = require("prop-types");

var form_1 = require("antd/lib/form");

var input_1 = require("antd/lib/input");

var input_number_1 = require("antd/lib/input-number");

var select_1 = require("antd/lib/select");

var date_picker_1 = require("antd/lib/date-picker");

var time_picker_1 = require("antd/lib/time-picker");

var radio_1 = require("antd/lib/radio");

var checkbox_1 = require("antd/lib/checkbox");

var switch_1 = require("antd/lib/switch");

var card_1 = require("antd/lib/card");

var upload_1 = require("antd/lib/upload");

var button_1 = require("antd/lib/button");

var tabs_1 = require("antd/lib/tabs");

var icon_1 = require("antd/lib/icon");

var message_1 = require("antd/lib/message");

var isPlainObject_1 = require("lodash/isPlainObject");

var localeContext_1 = require("../../core/localeContext");

var moment_1 = require("moment");

var CustomFormBase =
/** @class */
function (_super) {
  __extends(CustomFormBase, _super);

  function CustomFormBase(props) {
    var _this = _super.call(this, props) || this;

    _this._dataSource = _this._asMutable(props.dataSource);
    _this.optionsMap = {};
    _this.refsMap = {};
    _this._submitting = false;
    _this._validating = false;
    return _this;
  }

  CustomFormBase.prototype.componentDidMount = function () {
    this.mounted = true;
  };

  CustomFormBase.prototype.componentWillUnmount = function () {
    this.mounted = false;
  };

  CustomFormBase.prototype.componentDidUpdate = function (prevProps) {
    if (prevProps.dataSource !== this.props.dataSource) {
      this._dataSource = this._asMutable(this.props.dataSource);
    }
  };

  CustomFormBase.prototype._asMutable = function (obj) {
    var _this = this;

    if (Array.isArray(obj)) {
      var arr_1 = [];
      obj.forEach(function (d) {
        arr_1.push(_this._asMutable(d));
      });
      return arr_1;
    } else if (Object(obj) === obj) {
      var newObj = {};

      for (var key in obj) {
        if (Object(obj[key]) === obj[key]) {
          newObj[key] = this._asMutable(obj[key]);
        } else {
          if (obj.hasOwnProperty(key)) {
            newObj[key] = obj[key];
          }
        }
      }

      return newObj;
    } else {
      return obj;
    }
  };

  Object.defineProperty(CustomFormBase.prototype, "submitting", {
    get: function get() {
      return this._submitting;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(CustomFormBase.prototype, "validating", {
    get: function get() {
      return this._validating;
    },
    enumerable: true,
    configurable: true
  });

  CustomFormBase.prototype.validate = function (keep, attrName) {
    var _this = this;

    this._validating = true;
    return new Promise(function (resolve, reject) {
      _this.props.form.validateFields(function (err, body) {
        if (err) {
          _this._validating = false;
          reject(err);
          message_1["default"].error(_this.getLocale('illegal'));
        } else {
          body = _this.parseBody(body);
          var promises = [];
          /* eslint-disable react/no-string-refs */

          for (var name_1 in _this.refs) {
            promises.push(_this.refs[name_1].validate(keep, name_1));
          }

          Promise.all(promises).then(function (bodys) {
            var _a;

            _this._validating = false;

            if (bodys.length) {
              body = bodys.reduce(function (p, c) {
                if (Array.isArray(c)) {
                  if (p[c[0]]) {
                    p[c[0]].push(c[1]);
                  } else {
                    p[c[0]] = [c[1]];
                  }

                  return p;
                } else {
                  return _extends(p, c);
                }
              }, body);
            }

            if (keep && attrName) {
              var arr = attrName.split('@'); // 数组形式

              if (arr.length === 2) {
                resolve([arr[0], body]);
              } else {
                resolve((_a = {}, _a[attrName] = body, _a));
              }
            } else {
              resolve(body);
            }
          }, function (errs) {
            _this._validating = false;
            message_1["default"].error(_this.getLocale('illegal'));
            reject(errs);
          });
        }
      });
    });
  };

  CustomFormBase.prototype.handleSubmit = function (onSubmit, keep) {
    var _this = this;

    if (this.props.disabled) {
      return Promise.resolve(true);
    }

    this._submitting = true;
    return this.validate(keep).then(function (body) {
      var result;

      try {
        if (onSubmit) {
          result = onSubmit(body, _this.props.dataSource);
        } else if (_this.props.onSubmit) {
          result = _this.props.onSubmit(body, _this.props.dataSource);
        }
      } catch (e) {
        window.console.error(e);
      }

      if (result && result.then) {
        result.then(function () {
          _this._submitting = false;
        }, function () {
          _this._submitting = false;
        });
      } else {
        _this._submitting = false;
      }

      return result;
    });
  };

  CustomFormBase.prototype.parseBody = function (body) {
    var _a;

    if (this.props.normalize) {
      for (var name_2 in body) {
        if (body[name_2] !== undefined) {
          // 组合成数组
          if (this.optionsMap[name_2].getValue) {
            body[name_2] = this.optionsMap[name_2].getValue(body[name_2]);
          }

          if (this.optionsMap[name_2].originName) {
            var v = body[name_2];
            delete body[name_2];
            name_2 = this.optionsMap[name_2].originName;
            body[name_2] = body[name_2] || [];
            body[name_2].push(v);
          }
        }
      }
    }

    if (this.props.name) {
      return _a = {}, _a[this.props.name] = body, _a;
    } else {
      return body;
    }
  };

  CustomFormBase.prototype.handleCancel = function () {
    this.context.router.goBack();
  };

  CustomFormBase.prototype.getFormLayout = function (option, extra) {
    return _extends({}, this.props.formLayout, {
      label: option.title || option.name || extra.title,
      required: option.required || extra.required,
      hasFeedback: option.hasFeedback || extra.hasFeedback,
      help: option.help || extra.help,
      className: option.className || extra.className,
      extra: option.extra ? option.extra : option.icon || null
    });
  };

  CustomFormBase.prototype.getInitialValue = function (option, defaultValue) {
    var dataIndex = option.name || option.dataIndex;
    var initialValue = this._dataSource[dataIndex];

    if (this.props.normalize && initialValue !== undefined) {
      switch (option.type) {
        case 'boolean':
          if (typeof initialValue !== 'boolean') {
            initialValue = [false, true][parseInt(initialValue, 10)];

            option.getValue = function (value) {
              return value + 0;
            };

            option.builtIn = true;
          }

          break;

        case 'array':
          if (!Array.isArray(initialValue)) {
            initialValue = initialValue.split(',');

            option.getValue = function (value) {
              return Array.isArray(value) ? value.join(',') : String(value);
            };

            option.builtIn = true;
          }

          break;
      }
    }

    if (initialValue === undefined && !this.props.loading) {
      initialValue = defaultValue;
    }

    if (!this.optionsMap[dataIndex]) {
      this._dataSource[dataIndex] = initialValue;
      this.optionsMap[dataIndex] = option;
    }

    return initialValue;
  };

  CustomFormBase.prototype.renderInput = function (option, key, _onChange) {
    var _this = this;

    var dataIndex = option.name || option.dataIndex;

    if (!dataIndex) {
      return null;
    }

    var noFlattern = option.noFlattern === undefined ? this.props.noFlattern : option.noFlattern;
    var dataSource = noFlattern ? option.dataSource || this._dataSource : this._dataSource;

    if (option.children) {
      if (option.type === 'array') {
        var isArr_1 = option.children[0].children;
        var dataSources_1 = dataSource[dataIndex] || [];
        var tabs_2 = [];
        var indexes_1 = [];
        dataSources_1.forEach(function (d, index) {
          indexes_1.push(index + '');
          tabs_2.push({
            index: index + '',
            data: d
          });
        }); // 已经赋值过了

        if (this.refsMap[dataIndex]) {
          // 发现传入的dataSources有值，说明外部dataSource有变化，需要重新赋值，提取是之前的值不一样
          if (dataSources_1.length && dataSources_1 !== this.refsMap[dataIndex].dataSources) {
            this.refsMap[dataIndex] = {
              indexes: indexes_1,
              activeKey: indexes_1[0],
              tabs: tabs_2,
              dataSources: dataSources_1
            };
          }
        } else {
          // 赋值
          this.refsMap[dataIndex] = {
            indexes: indexes_1,
            activeKey: indexes_1[0],
            tabs: tabs_2,
            dataSources: dataSources_1
          };
        }

        var obj = this.refsMap[dataIndex];
        return React.createElement(card_1["default"], {
          className: "hc-customForm-card",
          key: key,
          title: option.title || dataIndex
        }, React.createElement(tabs_1["default"], {
          onChange: function onChange(activeKey) {
            obj.activeKey = activeKey;

            if (_this.mounted) {
              _this.forceUpdate();
            }
          },
          onEdit: function onEdit(targetKey, action) {
            var idx;

            if (action === 'add') {
              idx = obj.indexes.length ? 1 + parseInt(obj.indexes[obj.indexes.length - 1], 10) + '' : '0';
              obj.indexes.push(idx);
              obj.tabs.push({
                index: idx,
                data: {}
              });
              obj.activeKey = idx + '';
            } else {
              idx = obj.indexes.indexOf(targetKey);
              obj.indexes.splice(idx, 1);
              obj.tabs.splice(idx, 1); // 选中项小于触发项

              if (obj.activeKey >= targetKey) {
                if (idx > 0) {
                  obj.activeKey = idx - 1;
                } else if (obj.indexes.length) {
                  obj.activeKey = idx + 1;
                } else {
                  obj.activeKey = '';
                }

                obj.activeKey = obj.activeKey + '';
              }
            }

            if (_this.mounted) {
              _this.forceUpdate();
            }
          },
          activeKey: obj.activeKey,
          type: "editable-card"
        }, obj.tabs.map(function (item) {
          var key = dataIndex + '@' + obj.indexes[item.index];
          return React.createElement(tabs_1["default"].TabPane, {
            tab: _this.getLocale('dataIndex') + item.index,
            key: item.index,
            closable: true,
            forceRender: true
          }, isArr_1 ? (_this.optionsMap[key] = _extends({
            name: key,
            dataSource: dataSources_1[item.index],
            originName: dataIndex,
            title: _this.getLocale('legend')
          }, option.children[item.index])) && _this.renderInput(_this.optionsMap[key], key, function (e) {
            if (_onChange) {
              var arr = obj.tabs.map(function (d) {
                return d.data;
              });

              var o = _extends({}, _this.optionsMap[key]);

              obj.tabs[item.index].data = arr[item.index] = CustomForm.getValueFromEvent(e, o);
              o.name = o.originName;

              _onChange(arr, o);
            }
          }) : React.createElement(CustomForm, {
            formLayout: _this.props.formLayout,
            disabled: _this.props.disabled,
            ref: key,
            onChange: function onChange(e, o) {
              if (_onChange) {
                var arr = obj.tabs.map(function (d) {
                  return d.data;
                });
                arr[item.index][o.name] = CustomForm.getValueFromEvent(e, o);

                _onChange(arr, option);
              }
            },
            options: option.children,
            noLabel: _this.props.noLabel,
            parentDataSource: _this._dataSource,
            dataSource: dataSources_1[item.index],
            noButton: true,
            noFlattern: noFlattern
          }));
        })));
      } else if (noFlattern) {
        var formElm = React.createElement(CustomForm, {
          formLayout: this.props.formLayout,
          disabled: this.props.disabled,
          key: key,
          ref: dataIndex,
          title: option.title,
          name: option.embed ? '' : dataIndex,
          onChange: function onChange(e, o) {
            if (_onChange) {
              var obj_1 = _this.refsMap[dataIndex] ? _this.refsMap[dataIndex] : _this.refsMap[dataIndex] = {};
              obj_1[o.name] = CustomForm.getValueFromEvent(e, o);

              _onChange(obj_1, option);
            }
          },
          options: option.children,
          noLabel: this.props.noLabel,
          parentDataSource: this._dataSource,
          dataSource: dataSource[dataIndex],
          noButton: true,
          noFlattern: noFlattern
        });
        return option.embed ? React.createElement(form_1["default"].Item, _extends({
          key: key
        }, this.props.formLayout, {
          label: option.title || dataIndex
        }), React.createElement("div", {
          style: {
            border: '1px solid #ddd',
            padding: 10
          }
        }, formElm)) : formElm;
      } else {
        var renderInput = this.renderInput.bind(this);
        return React.createElement(card_1["default"], {
          className: "hc-customForm-card",
          key: key,
          title: option.title || dataIndex
        }, option.children.map(renderInput));
      }
    }

    var propsByState = option.getProps ? option.getProps.call(this, this._dataSource, function (nextState) {
      _extends(_this._dataSource, nextState);

      _this.forceUpdate();
    }, this.props.form) : {};

    if (propsByState.name === false) {
      return null;
    }

    var initialValue = this.getInitialValue(option, propsByState["default"] || option["default"]);
    var formItemProps = this.getFormLayout(option, propsByState);

    if (this.props.noLabel) {
      formItemProps.label = null;
    }

    var rules = [].concat(this.props.rules[dataIndex] || []);
    var defaultProps = {
      disabled: option.disabled || this.props.disabled,
      placeholder: option.placeholder
    };
    var decoratorProps = {
      defaultValue: initialValue,
      rules: rules.concat(option.rules || propsByState.rules || []),
      getValueFromEvent: function getValueFromEvent(e) {
        var v = CustomForm.getValueFromEvent(e, option);
        _this._dataSource[dataIndex] = v;

        if (_onChange) {
          _onChange(v, option);
        }

        if (option.onChange) {
          option.onChange(_this._dataSource, function (nextState) {
            _this.props.form.setFieldsValue(nextState);
          });
        }

        return v;
      }
    };

    if (option.renderInput) {
      return option.renderInput(option, function (node, dpros) {
        return React.createElement(form_1["default"].Item, _extends({
          key: key
        }, formItemProps), _this.props.form.getFieldDecorator(dataIndex, _extends(decoratorProps, dpros))(node));
      }, _extends(defaultProps, propsByState), this.props.form);
    } else {
      var input = CustomForm.getFieldInput(option, defaultProps, propsByState, decoratorProps);
      return React.createElement(form_1["default"].Item, _extends({
        key: key
      }, formItemProps), this.props.form.getFieldDecorator(dataIndex, decoratorProps)(input));
    }
  };

  CustomFormBase.prototype.clear = function () {
    this.props.form.resetFields();
    this.refsMap = {};
    /* eslint-disable react/no-string-refs */

    for (var name_3 in this.refs) {
      this.refs[name_3].clear();
    }
  };

  CustomFormBase.prototype.render = function () {
    var _this = this;

    var _buttons = CustomForm.getButtons(this.props.buttons, {
      noButton: this.props.noButton,
      save: this.getLocale('save'),
      cancel: this.getLocale('cancel'),
      onSubmit: function onSubmit() {
        return _this.handleSubmit(null, _this.props.keep);
      },
      onCancel: function onCancel() {
        return _this.handleCancel();
      }
    });

    var buttons = _buttons ? React.createElement(form_1["default"].Item, {
      wrapperCol: {
        offset: this.props.formLayout.labelCol.span,
        span: this.props.formLayout.wrapperCol.span
      }
    }, _buttons) : null;
    var compact = this.props.compact ? 'hc-customForm-compact ' : '';
    var className = compact + this.props.className;
    var formElm = React.createElement(form_1["default"], {
      className: 'hc-customForm ' + className,
      style: this.props.style,
      onSubmit: function onSubmit(e) {
        e.preventDefault();

        _this.handleSubmit(null, _this.props.keep);
      },
      layout: this.props.layout
    }, this.props.options.map(function (option, key) {
      return _this.renderInput(option, key, _this.props.onChange);
    }), " ", buttons);

    if (this.props.name) {
      return React.createElement(card_1["default"], {
        className: 'hc-customForm-card ' + className,
        title: this.props.title || this.props.name
      }, formElm);
    } else {
      return formElm;
    }
  };

  CustomFormBase.contextTypes = {
    router: prop_types_1["default"].object
  };
  CustomFormBase.propTypes = {
    className: prop_types_1["default"].string,
    style: prop_types_1["default"].object,
    dataSource: prop_types_1["default"].object,
    parentDataSource: prop_types_1["default"].object,
    options: prop_types_1["default"].array.isRequired,
    formLayout: prop_types_1["default"].object,
    rules: prop_types_1["default"].object,
    onSubmit: prop_types_1["default"].func,
    onChange: prop_types_1["default"].func,
    layout: prop_types_1["default"].string,
    buttons: prop_types_1["default"].object,
    name: prop_types_1["default"].string,
    title: prop_types_1["default"].string,
    noLabel: prop_types_1["default"].bool,
    noButton: prop_types_1["default"].bool,
    noFlattern: prop_types_1["default"].bool,
    normalize: prop_types_1["default"].bool,
    loading: prop_types_1["default"].bool,
    keep: prop_types_1["default"].bool,
    form: prop_types_1["default"].object,
    compact: prop_types_1["default"].bool,
    disabled: prop_types_1["default"].bool
  };
  CustomFormBase.defaultProps = {
    className: '',
    layout: 'horizontal',
    dataSource: {},
    compact: true,
    rules: {},
    normalize: true,
    options: [],
    formLayout: {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 19
      },
      hasFeedback: true,
      required: true
    }
  };
  CustomFormBase = __decorate([localeContext_1.localeContext('CustomForm'), __metadata("design:paramtypes", [Object])], CustomFormBase);
  return CustomFormBase;
}(react_1["default"].PureComponent);

var CustomForm = form_1["default"].create({
  withRef: true
})(CustomFormBase);
exports.CustomForm = CustomForm;

CustomForm.getLabel = function getLabel(item, option) {
  if (option.getLabel) {
    return option.getLabel(item);
  } else {
    return option.lableKey ? item[option.lableKey] : item.label || item.name;
  }
};

CustomForm.getValueFromEvent = function getValueFromEvent(e, option) {
  var v;

  if (Object(e) === e) {
    if (isPlainObject_1["default"](e) || isPlainObject_1["default"](e.__proto__)) {
      if (option.valuePropName) {
        v = e[option.valuePropName];
      } else {
        v = e.target ? e.target.value : e;
      }
    } else {
      v = e.target && e.target.nodeName ? e.target.value : e;
    }
  } else {
    v = e;
  }

  return option.builtIn && option.getValue ? option.getValue(v) : v;
};

CustomForm.getButtons = function getButtons(buttons, props) {
  if (!buttons && !props.noButton) {
    buttons = [];

    if (props.save) {
      buttons.push(React.createElement(button_1["default"], {
        key: 0,
        onClick: props.onSubmit,
        style: {
          marginRight: 10
        },
        type: "primary"
      }, props.save || 'save'));
    }

    if (props.cancel) {
      buttons.push(React.createElement(button_1["default"], {
        key: 1,
        onClick: props.onCancel,
        style: {
          marginRight: 10
        },
        type: "default"
      }, props.cancel || 'cancel'));
    }
  }

  return buttons;
};
/**
 * option = {
 *  dataType | type,
 *  // 枚举值
 *  enum,
 *  options,
 *
 *  // 特殊组件
 *  format,
 *  mode,
 *  // 上传
 *  dragger,
 *  action,
 *  valuePropName,
 *
 *  // 指定组件
 *  Component,
 *
 *  // 数字
 *  max,
 *  maxLength,
 *  maximum,
 *  // 置灰
 *  disabled,
 *  // 提示
 *  placeholder
 * }
 */


CustomForm.getFieldInput = function getFieldInput(option, props, stateProps, decorator) {
  var input;
  var dataFormat;

  if (option["enum"]) {
    input = React.createElement(radio_1["default"].Group, _extends({}, props, stateProps), option["enum"].map(function (item) {
      return React.createElement(radio_1["default"], {
        key: item,
        value: item
      }, item);
    }));
  } else {
    if (option.format) {
      switch (option.format) {
        case 'DATE_TIME':
          dataFormat = option.dataFormat || 'YYYY-MM-DD HH:mm:ss';
          decorator.initialValue = moment_1["default"](decorator.defaultValue);
          input = React.createElement(date_picker_1["default"], _extends({
            style: {
              maxWidth: 250
            },
            showTime: true,
            format: dataFormat
          }, props, stateProps));
          break;

        case 'DATE':
          dataFormat = option.dataFormat || 'YYYY-MM-DD';
          decorator.initialValue = moment_1["default"](decorator.defaultValue);
          input = React.createElement(date_picker_1["default"], _extends({
            style: {
              maxWidth: 250
            },
            format: dataFormat
          }, props, stateProps));
          break;

        case 'TIME':
          dataFormat = option.dataFormat || 'HH:mm:ss';
          decorator.initialValue = moment_1["default"](decorator.defaultValue);
          input = React.createElement(time_picker_1["default"], _extends({
            style: {
              maxWidth: 250
            },
            format: dataFormat
          }, props, stateProps));
          break;

        case 'DATE_RANGE':
          input = React.createElement(date_picker_1["default"].RangePicker, _extends({}, props, stateProps));
          break;

        case 'CDN_PIC':
        case 'FILE':
          dataFormat = option.description || 'Click or drag files to the upload area';
          decorator.valuePropName = option.valuePropName = 'fileList';

          if (option.dragger) {
            input = React.createElement(upload_1["default"].Dragger, _extends({}, props, stateProps, {
              listType: option.format === 'FILE' ? 'text' : 'picture',
              action: option.action
            }), React.createElement("p", {
              className: "ant-upload-drag-icon"
            }, React.createElement(icon_1["default"], {
              type: "inbox"
            })), React.createElement("p", {
              className: "ant-upload-text"
            }, dataFormat));
          } else {
            input = React.createElement(upload_1["default"], _extends({}, props, stateProps, {
              action: option.action,
              listType: option.format === 'FILE' ? 'text' : 'picture'
            }), React.createElement(button_1["default"], null, React.createElement(icon_1["default"], {
              type: "upload"
            }), " ", option.description || 'Upload'));
          }

          break;

        case 'SELECT':
          var options = stateProps.options || option.options;

          if (option.mode === 'radio') {
            input = React.createElement(radio_1["default"].Group, _extends({}, props, stateProps), options.map(function (item) {
              return React.createElement(radio_1["default"], {
                key: item.value,
                value: item.value,
                disabled: item.disabled
              }, CustomForm.getLabel(item, option));
            }));
          } else if (option.mode === 'checkbox') {
            input = React.createElement(checkbox_1["default"].Group, _extends({}, props, stateProps, {
              options: options
            }));
          } else {
            input = React.createElement(select_1["default"], _extends({
              mode: option.mode
            }, props, stateProps), options.map(function (item) {
              return React.createElement(select_1["default"].Option, {
                key: item.value || item.id,
                value: item.value || item.id,
                disabled: item.disabled
              }, CustomForm.getLabel(item, option));
            }));
          }

          break;

        case 'Component':
          input = React.createElement(option.Component, _extends({}, props, stateProps));
          break;

        case 'Element':
        case 'TEXT':
        case 'Function':
        case 'JSON':
          input = React.createElement(input_1["default"].TextArea, _extends({
            autosize: {
              minRows: 4,
              maxRows: 10
            }
          }, props, {
            onPressEnter: decorator.getValueFromEvent,
            onBlur: decorator.getValueFromEvent
          }, stateProps));
          break;

        default:
          input = React.createElement(input_1["default"], _extends({}, props, stateProps));
      }
    } else {
      var type = option.dataType || option.type;

      switch (type) {
        case 'number':
        case 'integer':
          var max = option.max;

          if (!max) {
            var maxLength = maxLength = option.maxLength ? option.maxLength : 10;
            max = +new Array(maxLength).join(9);

            if (option.maximum) {
              max = Number(maxLength + '0.' + option.maximum);
            }
          }

          input = React.createElement(input_number_1["default"], _extends({
            style: {
              maxWidth: 250
            },
            min: option.min ? option.min : 0,
            max: max
          }, props, stateProps));
          break;

        case 'boolean':
          decorator.valuePropName = option.valuePropName || 'checked';
          var placeholder = [].concat(option.placeholder);
          input = React.createElement(switch_1["default"], _extends({
            unCheckedChildren: placeholder[0],
            checkedChildren: placeholder[1]
          }, props, stateProps));
          break;

        case 'string':
        default:
          input = React.createElement(input_1["default"], _extends({}, props, stateProps));
          break;
      }
    }
  }

  decorator.initialValue = decorator.initialValue || decorator.defaultValue;
  return input;
};

CustomForm.prototype.getRealInstance = function () {
  return this.refs.wrappedComponent;
};

['handleSubmit', 'clear', 'validate'].forEach(function (method) {
  CustomForm.prototype[method] = function () {
    var _a;

    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    return (_a = this.refs.wrappedComponent)[method].apply(_a, args);
  };
});
Object.defineProperties(CustomForm.prototype, {
  submitting: {
    get: function get() {
      return this.refs.wrappedComponent.submitting;
    }
  },
  validating: {
    get: function get() {
      return this.refs.wrappedComponent.validating;
    }
  }
});