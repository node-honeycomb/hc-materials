import React from 'react';
import PropTypes from 'prop-types';
import {Form, Row, Col, Icon, Divider, message} from 'antd';

import {CustomForm} from '../customForm';
import {localeContext} from '../../core/localeContext';
@localeContext('Archive', {
  illegal: '表单校验失败',
})
class IArchive extends React.PureComponent {
  static propTypes = {
    options: PropTypes.array,
    dataSource: PropTypes.object,
    limit: PropTypes.number,
    form: PropTypes.object,
    cols: PropTypes.number,
    readonly: PropTypes.bool,
    compact: PropTypes.bool,

    layout: PropTypes.string,
    formItemLayout: PropTypes.object,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    formatter: PropTypes.func,
    noLabel: PropTypes.bool,
    style: PropTypes.object,
    className: PropTypes.string,

    buttons: PropTypes.array,
    buttonProps: PropTypes.object
  }

  static defaultProps = {
    options: [],
    dataSource: {},
    cols: 3,
    readonly: true,
    compact: false,
    buttonProps: {noButton: true},
    className: '',
    style: {}
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      expand: !props.limit || props.limit > props.options.length,
      dataSource: this.props.dataSource
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.dataSource !== prevState.dataSource) {
      return {dataSource: nextProps.dataSource || IArchive.defaultProps.dataSource};
    } else {
      return null;
    }
  }

  getFieldValue(name, option, editable) {
    let value;
    if (this.state.dataSource[name] === undefined) {
      value = option.value;
    } else {
      value = this.state.dataSource[name];
    }
    if (this.props.formatter) {
      return this.props.formatter(value, option);
    } else {
      if (editable) {
        return option.renderInput ? option.renderInput(value, this.state.dataSource) : value;
      } else {
        return option.render ? option.render(value, this.state.dataSource) : value;
      }
    }
  }

  getFieldInput(name, option) {
    const {form, readonly, onChange} = this.props;
    const editable = option.editable === undefined ? !readonly : option.editable;

    const stateProps = option.getProps && option.getProps.call(this, this.state.dataSource, (nextState) => {
      this.setState({
        dataSource: Object.assign({}, this.state.dataSource, nextState)
      });
    }, this.props.form);
    if (stateProps === false) return null;

    if (editable) {
      /**
       * option = {
       *  dataType | type,
       *  enum,
       *  options,
       *  format,
       *  mode,
       *  dragger,
       *  action,
       *  valuePropName,
       *  Component,
       *  max,
       *  maxLength,
       *  maximum,
       *  disabled,
       *  placeholder
       * }
       */
      const decorator = option.decorator || {};
      if (onChange) {
        decorator.getValueFromEvent = (e) => {
          const v = CustomForm.getValueFromEvent(e, option);
          onChange(v, name);
          return v;
        };
      }
      decorator.defaultValue = this.getFieldValue(name, option, editable);
      const fieldInput = CustomForm.getFieldInput(option, option.props, stateProps || {}, decorator);
      return form.getFieldDecorator(name, decorator)(fieldInput);
    } else {
      const value = this.getFieldValue(name, option);
      return form.getFieldDecorator(name, {})(React.isValidElement(value) ? value : (<span>{value || 'N/A'}</span>));
    }
  }

  getFields() {
    const {options, limit, cols, formItemLayout, compact, noLabel} = this.props;
    const span = Math.floor(24 / cols);
    const count = this.state.expand ? options.length : limit;
    // const {getFieldDecorator} = form;
    const fields = [];
    const itemStyle = compact ? {marginBottom: 0} : {};
    let item;
    let name;
    let label;
    let input;
    for (let i = 0; i < count; i++) {
      item = options[i];
      if (item && (item.dataIndex || item.name)) {
        name = item.dataIndex || item.name;
        label = noLabel ? null :  (item.title || item.name);
        input = this.getFieldInput(name, item);
        if (input !== null) {
          fields.push(
            <Col span={item.col ? item.col * span : item.span || span} key={name} style={{display: i < count ? 'block' : 'none'}}>
              <Form.Item {...formItemLayout} {...item.attrs} label={label} style={itemStyle}>
                {input}
              </Form.Item>
            </Col>
          );
        }
      }
    }
    return fields;
  }

  toggle = () => {
    this.setState({expand: !this.state.expand});
  }

  handleSubmit = (e) => {
    let onSubmit = this.props.onSubmit;
    if (typeof e === 'function') {
      onSubmit = e;
    } else {
      e && e.preventDefault();
    }

    return new Promise((resolve, reject) => {
      this.props.form.validateFields((err, values) => {
        if (err) {
          message.error(this.getLocale('illegal'));
          reject(err);
        } else {
          this.props.options.forEach(option => {
            if (option.getValue) {
              const name = option.dataIndex || option.name;
              values[name] = option.getValue(values[name]);
            }
          });
          resolve(onSubmit && onSubmit(values));
        }
      });
    });
  }

  getButtons() {
    const {buttons, buttonProps} = this.props;
    if (buttonProps.onSubmit) {
      buttonProps.onSubmit.bind(this.state.dataSource);
    } else {
      buttonProps.onSubmit = this.handleSubmit;
    }
    const justify = buttonProps.align || 'end';
    const _buttons = CustomForm.getButtons(buttons, buttonProps);
    return _buttons ? (<Row justify={justify} type="flex" className="hc-archive-btns" style={buttonProps.btnStyle}>{_buttons}</Row>) : null;
  }

  render() {
    return (<Form className={'hc-archive ' + this.props.className} style={this.props.style} layout={this.props.layout} onSubmit={this.props.buttonProps.noButton && this.handleSubmit}>
      <Row>
        {this.getFields()}
        {this.props.limit && this.props.limit < this.props.options.length ? (<a className="hc-archive-expand" onClick={this.toggle}>
          more <Icon type={this.state.expand ? 'up' : 'down'} />
        </a>) : null}
      </Row>
      {this.getButtons()}
    </Form>);
  }
}

class ArchiveGroup extends React.PureComponent {
  static propTypes = {
    options: PropTypes.array,
    dataSource: PropTypes.object
  }
  static defaultProps = {
    options: [],
    dataSource: {}
  }

  render() {
    return (<div className="hc-archive-group">
      {
        this.props.options.map(item => {
          const name = item.dataIndex || item.name;
          return (<div key={name} className="hc-archive-group_box">
            <h5>{item.title || name}</h5>
            <Divider />
            <Archive {...item.attrs} {...this.props} options={item.items} dataSource={this.props.dataSource[name]} />
          </div>);
        })
      }
    </div>);
  }
}

export const Archive = Form.create({name: 'archive'})(IArchive);
Archive.Group = ArchiveGroup;
