import React from 'react';
import PropTypes from 'prop-types';

import {Form, Input, InputNumber, Select, DatePicker, TimePicker, Radio, Checkbox, Switch, Card, Upload, Button, Tabs, Icon, message} from 'antd';

import isPlainObject from 'lodash/isPlainObject';
import {localeContext} from '../../core/localeContext';
import moment from 'moment';

@localeContext('CustomForm', {
  illegal: '表单校验失败',
  dataIndex: '数据项',
  legend: '数据结构',
  upload: '上传文件',
  save: '保存',
  cancel: '取消'
})
class CustomFormBase extends React.PureComponent {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
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
  }

  static defaultProps = {
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
  }

  constructor(props) {
    super(props);

    this._dataSource = this._asMutable(props.dataSource);
    this.optionsMap = {};
    this.refsMap = {};

    this._submitting = false;
    this._validating = false;
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.dataSource !== this.props.dataSource) {
      this._dataSource = this._asMutable(this.props.dataSource);
    }
  }

  _asMutable(obj) {
    if (Array.isArray(obj)) {
      const arr = [];
      obj.forEach(d => {
        arr.push(this._asMutable(d));
      });
      return arr;
    } else if (Object(obj) === obj) {
      const newObj = {};
      for (let key in obj) {
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

  get submitting() {
    return this._submitting;
  }

  get validating() {
    return this._validating;
  }

  validate(keep, attrName) {
    this._validating = true;
    return new Promise((resolve, reject) => {
      this
        .props
        .form
        .validateFields((err, body) => {
          if (err) {
            this._validating = false;
            reject(err);
            message.error(this.getLocale('illegal'));
          } else {
            body = this.parseBody(body);

            const promises = [];
            /* eslint-disable react/no-string-refs */
            for (let name in this.refs) {
              promises.push(this.refs[name].validate(keep, name));
            }
            Promise
              .all(promises)
              .then(bodys => {
                this._validating = false;
                if (bodys.length) {
                  body = bodys.reduce((p, c) => {
                    if (Array.isArray(c)) {
                      if (p[c[0]]) {
                        p[c[0]].push(c[1]);
                      } else {
                        p[c[0]] = [c[1]];
                      }
                      return p;
                    } else {
                      return Object.assign(p, c);
                    }
                  }, body);
                }
                if (keep && attrName) {
                  const arr = attrName.split('@');
                  // 数组形式
                  if (arr.length === 2) {
                    resolve([arr[0], body]);
                  } else {
                    resolve({
                      [attrName]: body
                    });
                  }
                } else {
                  resolve(body);
                }
              }, errs => {
                this._validating = false;
                message.error(this.getLocale('illegal'));
                reject(errs);
              });
          }
        });
    });
  }

  handleSubmit(onSubmit, keep) {
    if (this.props.disabled) {
      return Promise.resolve(true);
    }
    this._submitting = true;
    return this
      .validate(keep)
      .then(body => {
        let result;
        try {
          if (onSubmit) {
            result = onSubmit(body, this.props.dataSource);
          } else if (this.props.onSubmit) {
            result = this
              .props
              .onSubmit(body, this.props.dataSource);
          }
        } catch (e) {
          window.console.error(e);
        }
        if (result && result.then) {
          result.then(() => {
            this._submitting = false;
          }, () => {
            this._submitting = false;
          });
        } else {
          this._submitting = false;
        }
        return result;
      });
  }

  parseBody(body) {
    if (this.props.normalize) {
      for (let name in body) {
        if (body[name] !== undefined) {
          // 组合成数组
          if (this.optionsMap[name].getValue) {
            body[name] = this.optionsMap[name].getValue(body[name]);
          }
          if (this.optionsMap[name].originName) {
            let v = body[name];
            delete body[name];
            name = this.optionsMap[name].originName;
            body[name] = body[name] || [];
            body[name].push(v);
          }
        }
      }
    }
    if (this.props.name) {
      return {
        [this.props.name]: body
      };
    } else {
      return body;
    }
  }

  handleCancel() {
    this.history.goBack();
  }

  getFormLayout(option, extra) {
    return Object.assign({}, this.props.formLayout, {
      label: option.title || option.name || extra.title,
      required: option.required || extra.required,
      hasFeedback: option.hasFeedback || extra.hasFeedback,
      help: option.help || extra.help,
      className: option.className || extra.className,
      extra: option.extra ? option.extra : (option.icon || null)
    });
  }


  getInitialValue(option, defaultValue) {
    const dataIndex = option.name || option.dataIndex;
    let initialValue = this._dataSource[dataIndex];
    if (this.props.normalize && initialValue !== undefined) {
      switch (option.type) {
        case 'boolean':
          if (typeof initialValue !== 'boolean') {
            initialValue = [false, true][parseInt(initialValue, 10)];
            option.getValue = (value) => value + 0;
            option.builtIn = true;
          }
          break;
        case 'array':
          if (!Array.isArray(initialValue)) {
            initialValue = initialValue.split(',');
            option.getValue = (value) => Array.isArray(value) ? value.join(',') : String(value);
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

  renderInput(option, key, onChange) {
    const dataIndex = option.name || option.dataIndex;
    if (!dataIndex) {
      return null;
    }

    const noFlattern = option.noFlattern === undefined ? this.props.noFlattern : option.noFlattern;
    const dataSource = noFlattern ? (option.dataSource || this._dataSource) : this._dataSource;
    if (option.children) {
      if (option.type === 'array') {
        const isArr = option.children[0].children;
        const dataSources = dataSource[dataIndex] || [];
        const tabs = [];
        const indexes = [];
        dataSources.forEach((d, index) => {
          indexes.push(index + '');
          tabs.push({
            index: index + '',
            data: d
          });
        });
        // 已经赋值过了
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
        return (
          <Card
            className="hc-customForm-card"
            key={key}
            title={option.title || dataIndex}>
            <Tabs
              onChange={(activeKey) => {
                obj.activeKey = activeKey;
                if (this.mounted) {
                  this.forceUpdate();
                }
              }}
              onEdit={(targetKey, action) => {
                let idx;
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
                  obj.tabs.splice(idx, 1);
                  // 选中项小于触发项
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
                if (this.mounted) {
                  this.forceUpdate();
                }
              }}
              activeKey={obj.activeKey}
              type="editable-card">{obj
                .tabs
                .map((item) => {
                  const key = dataIndex + '@' + obj.indexes[item.index];
                  return (
                    <Tabs.TabPane
                      tab={this.getLocale('dataIndex') + item.index}
                      key={item.index}
                      closable={true}
                      forceRender={true}>
                      {isArr ?
                        (this.optionsMap[key] = Object.assign({
                          name: key,
                          dataSource: dataSources[item.index],
                          originName: dataIndex,
                          title: this.getLocale('legend')
                        }, option.children[item.index])) && this.renderInput(this.optionsMap[key], key, (e) => {
                          if (onChange) {
                            const arr = obj
                              .tabs
                              .map(d => d.data);
                            const o = Object.assign({}, this.optionsMap[key]);
                            obj.tabs[item.index].data = arr[item.index] = CustomForm.getValueFromEvent(e, o);
                            o.name = o.originName;
                            onChange(arr, o);
                          }
                        }) :
                        (<CustomForm
                          formLayout={this.props.formLayout}
                          disabled={this.props.disabled}
                          ref={key}
                          onChange={(e, o) => {
                            if (onChange) {
                              const arr = obj
                                .tabs
                                .map(d => d.data);
                              arr[item.index][o.name] = CustomForm.getValueFromEvent(e, o);
                              onChange(arr, option);
                            }
                          }}
                          options={option.children}
                          noLabel={this.props.noLabel}
                          parentDataSource={this._dataSource}
                          dataSource={dataSources[item.index]}
                          noButton={true}
                          noFlattern={noFlattern} />)}
                    </Tabs.TabPane>
                  );
                })}
            </Tabs>
          </Card>
        );
      } else if (noFlattern) {
        const formElm = (<CustomForm
          formLayout={this.props.formLayout}
          disabled={this.props.disabled}
          key={key}
          ref={dataIndex}
          title={option.title}
          name={option.embed ? '' : dataIndex}
          onChange={(e, o) => {
            if (onChange) {
              const obj = this.refsMap[dataIndex] ? this.refsMap[dataIndex] : (this.refsMap[dataIndex] = {});
              obj[o.name] = CustomForm.getValueFromEvent(e, o);
              onChange(obj, option);
            }
          }}
          options={option.children}
          noLabel={this.props.noLabel}
          parentDataSource={this._dataSource}
          dataSource={dataSource[dataIndex]}
          noButton={true}
          noFlattern={noFlattern} />);

        return option.embed ? (
          <Form.Item key={key} {...this.props.formLayout} label={option.title || dataIndex}><div style={{
            border: '1px solid #ddd',
            padding: 10
          }}>{formElm}</div></Form.Item>
        ) : formElm;
      } else {
        const renderInput = this
          .renderInput
          .bind(this);
        return (
          <Card
            className="hc-customForm-card"
            key={key}
            title={option.title || dataIndex}>{option
              .children
              .map(renderInput)}</Card>
        );
      }
    }

    const propsByState = option.getProps ? option.getProps.call(this, this._dataSource, (nextState) => {
      Object.assign(this._dataSource, nextState);
      this.forceUpdate();
    }, this.props.form) : {};
    if (propsByState.name === false) {
      return null;
    }
    const initialValue = this.getInitialValue(option, propsByState.default || option.default);

    const formItemProps = this.getFormLayout(option, propsByState);
    if (this.props.noLabel) {
      formItemProps.label = null;
    }
    let rules = [].concat(this.props.rules[dataIndex] || []);
    const defaultProps = {
      disabled: option.disabled || this.props.disabled,
      placeholder: option.placeholder
    };
    const decoratorProps = {
      defaultValue: initialValue,
      rules: rules.concat(option.rules || propsByState.rules || []),
      getValueFromEvent: (e) => {
        const v = CustomForm.getValueFromEvent(e, option);
        this._dataSource[dataIndex] = v;
        if (onChange) {
          onChange(v, option);
        }
        if (option.onChange) {
          option.onChange(this._dataSource, (nextState) => {
            this
              .props
              .form
              .setFieldsValue(nextState);
          });
        }
        return v;
      }
    };
    if (option.renderInput) {
      return option.renderInput(option, (node, dpros) => {
        return (
          <Form.Item key={key} {...formItemProps}>{this
            .props
            .form
            .getFieldDecorator(dataIndex, Object.assign(decoratorProps, dpros))(node)}</Form.Item>
        );
      }, Object.assign(defaultProps, propsByState), this.props.form);
    } else {
      const input = CustomForm.getFieldInput(option, defaultProps, propsByState, decoratorProps);
      return (
        <Form.Item key={key} {...formItemProps}>{this
          .props
          .form
          .getFieldDecorator(dataIndex, decoratorProps)(input)}</Form.Item>
      );
    }
  }

  clear() {
    this
      .props
      .form
      .resetFields();
    this.refsMap = {};
    /* eslint-disable react/no-string-refs */
    for (let name in this.refs) {
      this.refs[name].clear();
    }
  }

  render() {
    const _buttons = CustomForm.getButtons(this.props.buttons, {
      noButton: this.props.noButton,
      save: this.getLocale('save'),
      cancel: this.getLocale('cancel'),
      onSubmit: () => this.handleSubmit(null, this.props.keep),
      onCancel: () => this.handleCancel()
    });
    const buttons = _buttons ? (<Form.Item
      wrapperCol={{
        offset: this.props.formLayout.labelCol.span,
        span: this.props.formLayout.wrapperCol.span
      }}>{_buttons}</Form.Item>) : null;

    const compact = this.props.compact ? 'hc-customForm-compact ' : '';
    const className = compact + this.props.className;
    const formElm = (
      <Form
        className={'hc-customForm ' + className}
        style={this.props.style}
        onSubmit={e => {
          e.preventDefault();
          this.handleSubmit(null, this.props.keep);
        }}
        layout={this.props.layout}>{this
          .props
          .options
          .map((option, key) => this.renderInput(option, key, this.props.onChange))} {buttons}
      </Form>
    );
    if (this.props.name) {
      return (
        <Card
          className={'hc-customForm-card ' + className}
          title={this.props.title || this.props.name}>
          {formElm}
        </Card>
      );
    } else {
      return formElm;
    }
  }
}

const CustomForm = Form.create({withRef: true})(CustomFormBase);

CustomForm.getLabel = function getLabel(item, option) {
  if (option.getLabel) {
    return option.getLabel(item);
  } else {
    return option.lableKey ? item[option.lableKey] : item.label || item.name;
  }
};
CustomForm.getValueFromEvent = function getValueFromEvent(e, option) {
  let v;
  if (Object(e) === e) {
    if ((isPlainObject(e) || isPlainObject(e.__proto__))) {
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
      buttons.push(<Button
        key={0}
        onClick={props.onSubmit}
        style={{
          marginRight: 10
        }}
        type="primary">{props.save || 'save'}</Button>);
    }
    if (props.cancel) {
      buttons.push((<Button key={1}
        onClick={props.onCancel}
        style={{
          marginRight: 10
        }}
        type="default">{props.cancel || 'cancel'}</Button>));
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
  let input;
  let dataFormat;
  if (option.enum) {
    input = (
      <Radio.Group {...props} {...stateProps}>
        {option
          .enum
          .map(item => (
            <Radio key={item} value={item}>{item}</Radio>
          ))}
      </Radio.Group>
    );
  } else {
    if (option.format) {
      switch (option.format) {
        case 'DATE_TIME':
          dataFormat = option.dataFormat || 'YYYY-MM-DD HH:mm:ss';
          decorator.initialValue = moment(decorator.defaultValue);
          input = (<DatePicker
            style={{
              maxWidth: 250
            }}
            showTime
            format={dataFormat}
            {...props}
            {...stateProps} />);
          break;
        case 'DATE':
          dataFormat = option.dataFormat || 'YYYY-MM-DD';
          decorator.initialValue = moment(decorator.defaultValue);
          input = (<DatePicker
            style={{
              maxWidth: 250
            }}
            format={dataFormat}
            {...props}
            {...stateProps} />);
          break;
        case 'TIME':
          dataFormat = option.dataFormat || 'HH:mm:ss';
          decorator.initialValue = moment(decorator.defaultValue);
          input = (<TimePicker
            style={{
              maxWidth: 250
            }}
            format={dataFormat}
            {...props}
            {...stateProps} />);
          break;
        case 'DATE_RANGE':
          input = (<DatePicker.RangePicker {...props} {...stateProps} />);
          break;
        case 'CDN_PIC':
        case 'FILE':
          dataFormat = option.description || 'Click or drag files to the upload area';
          decorator.valuePropName = option.valuePropName = 'fileList';
          if (option.dragger) {
            input = (
              <Upload.Dragger
                {...props}
                {...stateProps}
                listType={option.format === 'FILE' ? 'text' : 'picture'}
                action={option.action}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">{dataFormat}</p>
              </Upload.Dragger>
            );
          } else {
            input = (
              <Upload
                {...props}
                {...stateProps}
                action={option.action}
                listType={option.format === 'FILE' ? 'text' : 'picture'}>
                <Button>
                  <Icon type="upload" /> {option.description || 'Upload'}
                </Button>
              </Upload>
            );
          }
          break;
        case 'SELECT':
          var options = stateProps.options || option.options;
          if (option.mode === 'radio') {
            input = (
              <Radio.Group {...props} {...stateProps} >
                {options.map(item => (
                  <Radio
                    key={item.value}
                    value={item.value}
                    disabled={item.disabled}>{CustomForm.getLabel(item, option)}</Radio>
                ))}
              </Radio.Group>
            );
          } else if (option.mode === 'checkbox') {
            input = (<Checkbox.Group {...props} {...stateProps} options={options} />);
          } else {
            input = (
              <Select mode={option.mode} {...props} {...stateProps}>
                {options.map(item => (
                  <Select.Option
                    key={item.value || item.id}
                    value={item.value || item.id}
                    disabled={item.disabled}>{CustomForm.getLabel(item, option)}</Select.Option>
                ))}
              </Select>
            );
          }
          break;
        case 'Component':
          input = (<option.Component {...props} {...stateProps} />);
          break;
        case 'Element':
        case 'TEXT':
        case 'Function':
        case 'JSON':
          input = (<Input.TextArea
            autosize={{
              minRows: 4,
              maxRows: 10
            }}
            {...props}
            onPressEnter={decorator.getValueFromEvent}
            onBlur={decorator.getValueFromEvent}
            {...stateProps} />);
          break;
        default:
          input = (<Input {...props} {...stateProps} />);
      }
    } else {
      const type = option.dataType || option.type;
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
          input = (<InputNumber
            style={{
              maxWidth: 250
            }}
            min={option.min ? option.min : 0}
            max={max}
            {...props}
            {...stateProps} />);
          break;
        case 'boolean':
          decorator.valuePropName = option.valuePropName || 'checked';
          var placeholder = [].concat(option.placeholder);
          input = (<Switch
            unCheckedChildren={placeholder[0]}
            checkedChildren={placeholder[1]}
            {...props}
            {...stateProps} />);
          break;
        case 'string':
        default:
          input = (<Input {...props} {...stateProps} />);
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
['handleSubmit', 'clear', 'validate'].forEach(method => {
  CustomForm.prototype[method] = function (...args) {
    return this.refs.wrappedComponent[method](...args);
  };
});
Object.defineProperties(CustomForm.prototype, {
  submitting: {
    get() {
      return this.refs.wrappedComponent.submitting;
    }
  },
  validating: {
    get() {
      return this.refs.wrappedComponent.validating;
    }
  }
});

export {CustomForm};
