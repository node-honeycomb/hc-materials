function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, InputNumber, Select, DatePicker, TimePicker, Radio, Checkbox, Switch, Card, Upload, Button, Tabs, Icon, message } from 'antd';
import isPlainObject from 'lodash/isPlainObject';
import { localeContext } from '../../core/localeContext';
import moment from 'moment';

var CustomFormBase =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(CustomFormBase, _React$PureComponent);

  function CustomFormBase(props) {
    var _this;

    _classCallCheck(this, CustomFormBase);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CustomFormBase).call(this, props));
    _this._dataSource = _this._asMutable(props.dataSource);
    _this.optionsMap = {};
    _this.refsMap = {};
    _this._submitting = false;
    _this._validating = false;
    return _this;
  }

  _createClass(CustomFormBase, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.mounted = true;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mounted = false;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.dataSource !== this.props.dataSource) {
        this._dataSource = this._asMutable(this.props.dataSource);
      }
    }
  }, {
    key: "_asMutable",
    value: function _asMutable(obj) {
      var _this2 = this;

      if (Array.isArray(obj)) {
        var arr = [];
        obj.forEach(function (d) {
          arr.push(_this2._asMutable(d));
        });
        return arr;
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
    }
  }, {
    key: "validate",
    value: function validate(keep, attrName) {
      var _this3 = this;

      this._validating = true;
      return new Promise(function (resolve, reject) {
        _this3.props.form.validateFields(function (err, body) {
          if (err) {
            _this3._validating = false;
            reject(err);
            message.error(_this3.getLocale('illegal'));
          } else {
            body = _this3.parseBody(body);
            var promises = [];
            /* eslint-disable react/no-string-refs */

            for (var name in _this3.refs) {
              promises.push(_this3.refs[name].validate(keep, name));
            }

            Promise.all(promises).then(function (bodys) {
              _this3._validating = false;

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
                  resolve(_defineProperty({}, attrName, body));
                }
              } else {
                resolve(body);
              }
            }, function (errs) {
              _this3._validating = false;
              message.error(_this3.getLocale('illegal'));
              reject(errs);
            });
          }
        });
      });
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(onSubmit, keep) {
      var _this4 = this;

      if (this.props.disabled) {
        return Promise.resolve(true);
      }

      this._submitting = true;
      return this.validate(keep).then(function (body) {
        var result;

        try {
          if (onSubmit) {
            result = onSubmit(body, _this4.props.dataSource);
          } else if (_this4.props.onSubmit) {
            result = _this4.props.onSubmit(body, _this4.props.dataSource);
          }
        } catch (e) {
          window.console.error(e);
        }

        if (result && result.then) {
          result.then(function () {
            _this4._submitting = false;
          }, function () {
            _this4._submitting = false;
          });
        } else {
          _this4._submitting = false;
        }

        return result;
      });
    }
  }, {
    key: "parseBody",
    value: function parseBody(body) {
      if (this.props.normalize) {
        for (var name in body) {
          if (body[name] !== undefined) {
            // 组合成数组
            if (this.optionsMap[name].getValue) {
              body[name] = this.optionsMap[name].getValue(body[name]);
            }

            if (this.optionsMap[name].originName) {
              var v = body[name];
              delete body[name];
              name = this.optionsMap[name].originName;
              body[name] = body[name] || [];
              body[name].push(v);
            }
          }
        }
      }

      if (this.props.name) {
        return _defineProperty({}, this.props.name, body);
      } else {
        return body;
      }
    }
  }, {
    key: "handleCancel",
    value: function handleCancel() {
      this.history.goBack();
    }
  }, {
    key: "getFormLayout",
    value: function getFormLayout(option, extra) {
      return _extends({}, this.props.formLayout, {
        label: option.title || option.name || extra.title,
        required: option.required || extra.required,
        hasFeedback: option.hasFeedback || extra.hasFeedback,
        help: option.help || extra.help,
        className: option.className || extra.className,
        extra: option.extra ? option.extra : option.icon || null
      });
    }
  }, {
    key: "getInitialValue",
    value: function getInitialValue(option, defaultValue) {
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
    }
  }, {
    key: "renderInput",
    value: function renderInput(option, key, _onChange) {
      var _this5 = this;

      var dataIndex = option.name || option.dataIndex;

      if (!dataIndex) {
        return null;
      }

      var noFlattern = option.noFlattern === undefined ? this.props.noFlattern : option.noFlattern;
      var dataSource = noFlattern ? option.dataSource || this._dataSource : this._dataSource;

      if (option.children) {
        if (option.type === 'array') {
          var isArr = option.children[0].children;
          var dataSources = dataSource[dataIndex] || [];
          var tabs = [];
          var indexes = [];
          dataSources.forEach(function (d, index) {
            indexes.push(index + '');
            tabs.push({
              index: index + '',
              data: d
            });
          }); // 已经赋值过了

          if (this.refsMap[dataIndex]) {
            // 发现传入的dataSources有值，说明外部dataSource有变化，需要重新赋值，提取是之前的值不一样
            if (dataSources.length && dataSources !== this.refsMap[dataIndex].dataSources) {
              this.refsMap[dataIndex] = {
                indexes: indexes,
                activeKey: indexes[0],
                tabs: tabs,
                dataSources: dataSources
              };
            }
          } else {
            // 赋值
            this.refsMap[dataIndex] = {
              indexes: indexes,
              activeKey: indexes[0],
              tabs: tabs,
              dataSources: dataSources
            };
          }

          var obj = this.refsMap[dataIndex];
          return React.createElement(Card, {
            className: "hc-customForm-card",
            key: key,
            title: option.title || dataIndex
          }, React.createElement(Tabs, {
            onChange: function onChange(activeKey) {
              obj.activeKey = activeKey;

              if (_this5.mounted) {
                _this5.forceUpdate();
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

              if (_this5.mounted) {
                _this5.forceUpdate();
              }
            },
            activeKey: obj.activeKey,
            type: "editable-card"
          }, obj.tabs.map(function (item) {
            var key = dataIndex + '@' + obj.indexes[item.index];
            return React.createElement(Tabs.TabPane, {
              tab: _this5.getLocale('dataIndex') + item.index,
              key: item.index,
              closable: true,
              forceRender: true
            }, isArr ? (_this5.optionsMap[key] = _extends({
              name: key,
              dataSource: dataSources[item.index],
              originName: dataIndex,
              title: _this5.getLocale('legend')
            }, option.children[item.index])) && _this5.renderInput(_this5.optionsMap[key], key, function (e) {
              if (_onChange) {
                var arr = obj.tabs.map(function (d) {
                  return d.data;
                });

                var o = _extends({}, _this5.optionsMap[key]);

                obj.tabs[item.index].data = arr[item.index] = CustomForm.getValueFromEvent(e, o);
                o.name = o.originName;

                _onChange(arr, o);
              }
            }) : React.createElement(CustomForm, {
              formLayout: _this5.props.formLayout,
              disabled: _this5.props.disabled,
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
              noLabel: _this5.props.noLabel,
              parentDataSource: _this5._dataSource,
              dataSource: dataSources[item.index],
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
                var _obj = _this5.refsMap[dataIndex] ? _this5.refsMap[dataIndex] : _this5.refsMap[dataIndex] = {};

                _obj[o.name] = CustomForm.getValueFromEvent(e, o);

                _onChange(_obj, option);
              }
            },
            options: option.children,
            noLabel: this.props.noLabel,
            parentDataSource: this._dataSource,
            dataSource: dataSource[dataIndex],
            noButton: true,
            noFlattern: noFlattern
          });
          return option.embed ? React.createElement(Form.Item, _extends({
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
          return React.createElement(Card, {
            className: "hc-customForm-card",
            key: key,
            title: option.title || dataIndex
          }, option.children.map(renderInput));
        }
      }

      var propsByState = option.getProps ? option.getProps.call(this, this._dataSource, function (nextState) {
        _extends(_this5._dataSource, nextState);

        _this5.forceUpdate();
      }, this.props.form) : {};

      if (propsByState === false || propsByState.name === false) {
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
          _this5._dataSource[dataIndex] = v;

          if (_onChange) {
            _onChange(v, option);
          }

          if (option.onChange) {
            option.onChange(_this5._dataSource, function (nextState) {
              _this5.props.form.setFieldsValue(nextState);
            });
          }

          return v;
        }
      };

      if (option.renderInput) {
        return option.renderInput(option, function (node, dpros) {
          return React.createElement(Form.Item, _extends({
            key: key
          }, formItemProps), _this5.props.form.getFieldDecorator(dataIndex, _extends(decoratorProps, dpros))(node));
        }, _extends(defaultProps, propsByState), this.props.form);
      } else {
        var input = CustomForm.getFieldInput(option, defaultProps, propsByState, decoratorProps);
        return React.createElement(Form.Item, _extends({
          key: key
        }, formItemProps), this.props.form.getFieldDecorator(dataIndex, decoratorProps)(input));
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      this.props.form.resetFields();
      this.refsMap = {};
      /* eslint-disable react/no-string-refs */

      for (var name in this.refs) {
        this.refs[name].clear();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      var _buttons = CustomForm.getButtons(this.props.buttons, {
        noButton: this.props.noButton,
        save: this.getLocale('save'),
        cancel: this.getLocale('cancel'),
        onSubmit: function onSubmit() {
          return _this6.handleSubmit(null, _this6.props.keep);
        },
        onCancel: function onCancel() {
          return _this6.handleCancel();
        }
      });

      var buttons = _buttons ? React.createElement(Form.Item, {
        wrapperCol: {
          offset: this.props.formLayout.labelCol.span,
          span: this.props.formLayout.wrapperCol.span
        }
      }, _buttons) : null;
      var compact = this.props.compact ? 'hc-customForm-compact ' : '';
      var className = compact + this.props.className;
      var formElm = React.createElement(Form, {
        className: 'hc-customForm ' + className,
        style: this.props.style,
        onSubmit: function onSubmit(e) {
          e.preventDefault();

          _this6.handleSubmit(null, _this6.props.keep);
        },
        layout: this.props.layout
      }, this.props.options.map(function (option, key) {
        return _this6.renderInput(option, key, _this6.props.onChange);
      }), " ", buttons);

      if (this.props.name) {
        return React.createElement(Card, {
          className: 'hc-customForm-card ' + className,
          title: this.props.title || this.props.name
        }, formElm);
      } else {
        return formElm;
      }
    }
  }, {
    key: "submitting",
    get: function get() {
      return this._submitting;
    }
  }, {
    key: "validating",
    get: function get() {
      return this._validating;
    }
  }]);

  return CustomFormBase;
}(React.PureComponent);

CustomFormBase.contextTypes = {
  router: PropTypes.object
};
CustomFormBase.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  dataSource: PropTypes.object,
  parentDataSource: PropTypes.object,
  options: PropTypes.array.isRequired,
  formLayout: PropTypes.object,
  rules: PropTypes.object,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  layout: PropTypes.string,
  buttons: PropTypes.object,
  name: PropTypes.string,
  title: PropTypes.string,
  noLabel: PropTypes.bool,
  noButton: PropTypes.bool,
  noFlattern: PropTypes.bool,
  normalize: PropTypes.bool,
  loading: PropTypes.bool,
  keep: PropTypes.bool,
  form: PropTypes.object,
  compact: PropTypes.bool,
  disabled: PropTypes.bool
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
CustomFormBase = __decorate([localeContext('CustomForm', {
  illegal: '表单校验失败',
  dataIndex: '数据项',
  legend: '数据结构',
  upload: '上传文件',
  save: '保存',
  cancel: '取消'
}), __metadata("design:paramtypes", [Object])], CustomFormBase);
var CustomForm = Form.create({
  withRef: true
})(CustomFormBase);

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
    if (isPlainObject(e) || isPlainObject(e.__proto__)) {
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
      buttons.push(React.createElement(Button, {
        key: 0,
        onClick: props.onSubmit,
        style: {
          marginRight: 10
        },
        type: "primary"
      }, props.save || 'save'));
    }

    if (props.cancel) {
      buttons.push(React.createElement(Button, {
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
  delete decorator.initialValue;
  var input;
  var dataFormat;

  if (option["enum"]) {
    input = React.createElement(Radio.Group, _extends({}, props, stateProps), option["enum"].map(function (item) {
      return React.createElement(Radio, {
        key: item,
        value: item
      }, item);
    }));
  } else {
    if (option.format) {
      switch (option.format) {
        case 'DATE_TIME':
          dataFormat = option.dataFormat || 'YYYY-MM-DD HH:mm:ss';
          decorator.initialValue = moment(decorator.defaultValue);
          input = React.createElement(DatePicker, _extends({
            style: {
              maxWidth: 250
            },
            showTime: true,
            format: dataFormat
          }, props, stateProps));
          break;

        case 'DATE':
          dataFormat = option.dataFormat || 'YYYY-MM-DD';
          decorator.initialValue = moment(decorator.defaultValue);
          input = React.createElement(DatePicker, _extends({
            style: {
              maxWidth: 250
            },
            format: dataFormat
          }, props, stateProps));
          break;

        case 'TIME':
          dataFormat = option.dataFormat || 'HH:mm:ss';
          decorator.initialValue = moment(decorator.defaultValue);
          input = React.createElement(TimePicker, _extends({
            style: {
              maxWidth: 250
            },
            format: dataFormat
          }, props, stateProps));
          break;

        case 'DATE_RANGE':
          input = React.createElement(DatePicker.RangePicker, _extends({}, props, stateProps));
          break;

        case 'CDN_PIC':
        case 'FILE':
          dataFormat = option.description || 'Click or drag files to the upload area';
          decorator.valuePropName = option.valuePropName = 'fileList';

          if (option.dragger) {
            input = React.createElement(Upload.Dragger, _extends({}, props, stateProps, {
              listType: option.format === 'FILE' ? 'text' : 'picture',
              action: option.action
            }), React.createElement("p", {
              className: "ant-upload-drag-icon"
            }, React.createElement(Icon, {
              type: "inbox"
            })), React.createElement("p", {
              className: "ant-upload-text"
            }, dataFormat));
          } else {
            input = React.createElement(Upload, _extends({}, props, stateProps, {
              action: option.action,
              listType: option.format === 'FILE' ? 'text' : 'picture'
            }), React.createElement(Button, null, React.createElement(Icon, {
              type: "upload"
            }), " ", option.description || 'Upload'));
          }

          break;

        case 'SELECT':
          var options = stateProps.options || option.options;

          if (option.mode === 'radio') {
            input = React.createElement(Radio.Group, _extends({}, props, stateProps), options.map(function (item) {
              return React.createElement(Radio, {
                key: item.value,
                value: item.value,
                disabled: item.disabled
              }, CustomForm.getLabel(item, option));
            }));
          } else if (option.mode === 'checkbox') {
            input = React.createElement(Checkbox.Group, _extends({}, props, stateProps, {
              options: options
            }));
          } else {
            input = React.createElement(Select, _extends({
              mode: option.mode
            }, props, stateProps), options.map(function (item) {
              return React.createElement(Select.Option, {
                key: item.value === undefined ? item.id : item.value,
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
          input = React.createElement(Input.TextArea, _extends({
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
          input = React.createElement(Input, _extends({}, props, stateProps));
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

          input = React.createElement(InputNumber, _extends({
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
          input = React.createElement(Switch, _extends({
            unCheckedChildren: placeholder[0],
            checkedChildren: placeholder[1]
          }, props, stateProps));
          break;

        case 'string':
        default:
          input = React.createElement(Input, _extends({}, props, stateProps));
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
    var _this$refs$wrappedCom;

    return (_this$refs$wrappedCom = this.refs.wrappedComponent)[method].apply(_this$refs$wrappedCom, arguments);
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
export { CustomForm };