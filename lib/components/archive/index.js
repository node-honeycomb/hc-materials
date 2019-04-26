"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Archive = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _form = _interopRequireDefault(require("antd/lib/form"));

var _row = _interopRequireDefault(require("antd/lib/row"));

var _col = _interopRequireDefault(require("antd/lib/col"));

var _icon = _interopRequireDefault(require("antd/lib/icon"));

var _divider = _interopRequireDefault(require("antd/lib/divider"));

var _customForm = require("../customForm");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

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
      e && e.preventDefault();

      _this.props.form.validateFields(function (err, values) {
        if (!err) {
          _this.props.options.forEach(function (option) {
            if (option.getValue) {
              var name = option.dataIndex || option.name;
              values[name] = option.getValue(values[name]);
            }
          });

          _this.props.onSubmit && _this.props.onSubmit(values);
        }
      });
    };

    _this.state = {
      expand: !props.limit || props.limit > props.options.length,
      dataSource: _this.props.dataSource
    };
    return _this;
  }

  _createClass(IArchive, [{
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
          onChange = _this$props.onChange;
      var editable = option.editable === undefined ? !readonly : option.editable;

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
            var v = _customForm.CustomForm.getValueFromEvent(e, option);

            onChange(v, name);
            return v;
          };
        }

        decorator.defaultValue = this.getFieldValue(name, option, editable);
        var stateProps = option.getProps && option.getProps.call(this, this.props, this.state.dataSource, function (nextState) {
          _this2.setState({
            dataSource: _extends({}, _this2.state.dataSource, nextState)
          });
        }, this.props.form);
        if (stateProps === false) return null;

        var fieldInput = _customForm.CustomForm.getFieldInput(option, option.props, stateProps || {}, decorator);

        return form.getFieldDecorator(name, decorator)(fieldInput);
      } else {
        var value = this.getFieldValue(name, option);
        return form.getFieldDecorator(name, {})(_react["default"].isValidElement(value) ? value : _react["default"].createElement("span", null, value));
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

          if (input !== undefined) {
            fields.push(_react["default"].createElement(_col["default"], {
              span: item.col ? item.col * span : item.span || span,
              key: name,
              style: {
                display: i < count ? 'block' : 'none'
              }
            }, _react["default"].createElement(_form["default"].Item, _extends({}, formItemLayout, item.attrs, {
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

      var _buttons = _customForm.CustomForm.getButtons(buttons, buttonProps);

      return _buttons ? _react["default"].createElement(_row["default"], {
        justify: justify,
        type: "flex",
        className: "hc-archive-btns",
        style: buttonProps.btnStyle
      }, _buttons) : null;
    }
  }, {
    key: "render",
    value: function render() {
      return _react["default"].createElement(_form["default"], {
        className: 'hc-archive ' + this.props.className,
        style: this.props.style,
        layout: this.props.layout,
        onSubmit: this.props.buttonProps.noButton && this.handleSubmit
      }, _react["default"].createElement(_row["default"], {
        gutter: 24
      }, this.getFields(), this.props.limit && this.props.limit < this.props.options.length ? _react["default"].createElement("a", {
        className: "hc-archive-expand",
        onClick: this.toggle
      }, "more ", _react["default"].createElement(_icon["default"], {
        type: this.state.expand ? 'up' : 'down'
      })) : null), this.getButtons());
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.dataSource !== prevState.dataSource) {
        return {
          dataSource: nextProps.dataSource
        };
      } else {
        return null;
      }
    }
  }]);

  return IArchive;
}(_react["default"].PureComponent);

IArchive.propTypes = {
  options: _propTypes["default"].array,
  dataSource: _propTypes["default"].object,
  limit: _propTypes["default"].number,
  form: _propTypes["default"].object,
  cols: _propTypes["default"].number,
  readonly: _propTypes["default"].bool,
  compact: _propTypes["default"].bool,
  layout: _propTypes["default"].string,
  formItemLayout: _propTypes["default"].object,
  onChange: _propTypes["default"].func,
  onSubmit: _propTypes["default"].func,
  formatter: _propTypes["default"].func,
  noLabel: _propTypes["default"].bool,
  style: _propTypes["default"].object,
  className: _propTypes["default"].string,
  buttons: _propTypes["default"].array,
  buttonProps: _propTypes["default"].object
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

      return _react["default"].createElement("div", {
        className: "hc-archive-group"
      }, this.props.options.map(function (item) {
        return _react["default"].createElement("div", {
          key: item.name,
          className: "hc-archive-group_box"
        }, _react["default"].createElement("h5", null, item.title || item.name), _react["default"].createElement(_divider["default"], null), _react["default"].createElement(Archive, _extends({}, item.attrs, _this3.props, {
          options: item.items,
          dataSource: _this3.props.dataSource[item.name]
        })));
      }));
    }
  }]);

  return ArchiveGroup;
}(_react["default"].PureComponent);

ArchiveGroup.propTypes = {
  options: _propTypes["default"].array,
  dataSource: _propTypes["default"].object
};
ArchiveGroup.defaultProps = {
  options: [],
  dataSource: {}
};

var Archive = _form["default"].create({
  name: 'archive'
})(IArchive);

exports.Archive = Archive;
Archive.Group = ArchiveGroup;