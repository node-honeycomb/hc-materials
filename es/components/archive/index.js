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
import { Form, Row, Col, Icon, Divider, message } from 'antd';
import { CustomForm } from '../customForm';
import { localeContext } from '../../core/localeContext';

var IArchive =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(IArchive, _React$PureComponent);

  function IArchive(props, context) {
    var _this;

    _classCallCheck(this, IArchive);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(IArchive).call(this, props, context));

    _this.toggle = function () {
      _this.setState({
        expand: !_this.state.expand
      });
    };

    _this.handleSubmit = function (e) {
      var onSubmit = _this.props.onSubmit;

      if (typeof e === 'function') {
        onSubmit = e;
      } else {
        e && e.preventDefault();
      }

      return new Promise(function (resolve, reject) {
        _this.props.form.validateFields(function (err, values) {
          if (err) {
            message.error(_this.getLocale('illegal'));
            reject(err);
          } else {
            _this.props.options.forEach(function (option) {
              if (option.getValue) {
                var name = option.dataIndex || option.name;
                var v = option.getValue(values[name], values);

                if (v !== undefined) {
                  values[name] = v;
                }
              }
            });

            resolve(onSubmit && onSubmit(values));
          }
        });
      });
    };

    _this.state = {
      expand: !props.limit || props.limit > props.options.length,
      dataSource: _this.props.dataSource
    };
    return _this;
  }

  _createClass(IArchive, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.dataSource && this.props.dataSource !== prevProps.dataSource) {
        this.setState({
          dataSource: this.props.dataSource
        });
      }
    }
  }, {
    key: "getFieldValue",
    value: function getFieldValue(name, option, editable) {
      var value;

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
  }, {
    key: "getFieldInput",
    value: function getFieldInput(name, option) {
      var _this2 = this;

      var _this$props = this.props,
          form = _this$props.form,
          readonly = _this$props.readonly,
          onChange = _this$props.onChange,
          disabled = _this$props.disabled;
      var editable = option.editable === undefined ? !readonly : option.editable;
      var stateProps = option.getProps && option.getProps.call(this, this.state.dataSource, function (nextState) {
        _this2.setState({
          dataSource: _extends({}, _this2.state.dataSource, nextState)
        });
      }, this.props.form);

      if (stateProps === false) {
        return null;
      } else if (Object(stateProps) !== stateProps) {
        stateProps = {};
      }

      if ((!option.props || option.props.disabled === undefined) && stateProps.disabled === undefined) {
        stateProps.disabled = disabled;
      }

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
        var decorator = option.decorator || {};

        if (onChange) {
          decorator.getValueFromEvent = function (e) {
            var v = CustomForm.getValueFromEvent(e, option);
            onChange(v, name);
            return v;
          };
        }

        decorator.defaultValue = this.getFieldValue(name, option, editable);
        var fieldInput = CustomForm.getFieldInput(option, option.props, stateProps, decorator);
        return form.getFieldDecorator(name, decorator)(fieldInput);
      } else {
        var value = this.getFieldValue(name, option);

        if (!React.isValidElement(value)) {
          if (Object(value) === value) {
            value = JSON.stringify(value, null, 2);
          } else {
            value = value || 'N/A';
          }

          value = React.createElement("span", null, value);
        }

        return form.getFieldDecorator(name, {})(value);
      }
    }
  }, {
    key: "getFields",
    value: function getFields() {
      var _this$props2 = this.props,
          options = _this$props2.options,
          limit = _this$props2.limit,
          cols = _this$props2.cols,
          formItemLayout = _this$props2.formItemLayout,
          compact = _this$props2.compact,
          noLabel = _this$props2.noLabel;
      var span = Math.floor(24 / cols);
      var count = this.state.expand ? options.length : limit; // const {getFieldDecorator} = form;

      var fields = [];
      var itemStyle = compact ? {
        marginBottom: 0
      } : {};
      var item;
      var name;
      var label;
      var input;

      for (var i = 0; i < count; i++) {
        item = options[i];

        if (item && (item.dataIndex || item.name)) {
          name = item.dataIndex || item.name;
          label = noLabel ? null : item.title || item.name;
          input = this.getFieldInput(name, item);

          if (input !== null) {
            fields.push(React.createElement(Col, {
              span: item.col ? item.col * span : item.span || span,
              key: name,
              style: {
                display: i < count ? 'block' : 'none'
              }
            }, React.createElement(Form.Item, _extends({}, formItemLayout, item.attrs, {
              label: label,
              style: itemStyle
            }), input)));
          }
        }
      }

      return fields;
    }
  }, {
    key: "getButtons",
    value: function getButtons() {
      var _this$props3 = this.props,
          buttons = _this$props3.buttons,
          buttonProps = _this$props3.buttonProps;

      if (buttonProps.onSubmit) {
        buttonProps.onSubmit.bind(this.state.dataSource);
      } else {
        buttonProps.onSubmit = this.handleSubmit;
      }

      var justify = buttonProps.align || 'end';

      var _buttons = CustomForm.getButtons(buttons, buttonProps);

      return _buttons ? React.createElement(Row, {
        justify: justify,
        type: "flex",
        className: "hc-archive-btns",
        style: buttonProps.btnStyle
      }, _buttons) : null;
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(Form, {
        className: 'hc-archive ' + this.props.className,
        style: this.props.style,
        layout: this.props.layout,
        onSubmit: this.props.buttonProps.noButton && this.handleSubmit
      }, React.createElement(Row, null, this.getFields(), this.props.limit && this.props.limit < this.props.options.length ? React.createElement("a", {
        className: "hc-archive-expand",
        onClick: this.toggle
      }, "more ", React.createElement(Icon, {
        type: this.state.expand ? 'up' : 'down'
      })) : null), this.getButtons());
    }
  }]);

  return IArchive;
}(React.PureComponent);

IArchive.propTypes = {
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
  buttonProps: PropTypes.object,
  disabled: PropTypes.bool
};
IArchive.defaultProps = {
  options: [],
  dataSource: {},
  cols: 3,
  readonly: true,
  compact: false,
  buttonProps: {
    noButton: true
  },
  className: '',
  style: {}
};
IArchive = __decorate([localeContext('Archive', {
  illegal: '表单校验失败'
}), __metadata("design:paramtypes", [Object, Object])], IArchive);

var ArchiveGroup =
/*#__PURE__*/
function (_React$PureComponent2) {
  _inherits(ArchiveGroup, _React$PureComponent2);

  function ArchiveGroup() {
    _classCallCheck(this, ArchiveGroup);

    return _possibleConstructorReturn(this, _getPrototypeOf(ArchiveGroup).apply(this, arguments));
  }

  _createClass(ArchiveGroup, [{
    key: "render",
    value: function render() {
      var _this3 = this;

      return React.createElement("div", {
        className: "hc-archive-group"
      }, this.props.options.map(function (item) {
        var name = item.dataIndex || item.name;
        return React.createElement("div", {
          key: name,
          className: "hc-archive-group_box"
        }, React.createElement("h5", null, item.title || name), React.createElement(Divider, null), React.createElement(Archive, _extends({}, item.attrs, _this3.props, {
          options: item.items,
          dataSource: _this3.props.dataSource[name]
        })));
      }));
    }
  }]);

  return ArchiveGroup;
}(React.PureComponent);

ArchiveGroup.propTypes = {
  options: PropTypes.array,
  dataSource: PropTypes.object
};
ArchiveGroup.defaultProps = {
  options: [],
  dataSource: {}
};
export var Archive = Form.create({
  name: 'archive'
})(IArchive);
Archive.Group = ArchiveGroup;