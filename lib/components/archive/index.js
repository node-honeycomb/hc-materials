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

var react_1 = require("react");

var prop_types_1 = require("prop-types");

var form_1 = require("antd/lib/form");

var row_1 = require("antd/lib/row");

var col_1 = require("antd/lib/col");

var icon_1 = require("antd/lib/icon");

var divider_1 = require("antd/lib/divider");

var customForm_1 = require("../customForm");

var IArchive =
/** @class */
function (_super) {
  __extends(IArchive, _super);

  function IArchive(props, context) {
    var _this = _super.call(this, props, context) || this;

    _this.toggle = function () {
      _this.setState({
        expand: !_this.state.expand
      });
    };

    _this.handleSubmit = function (e) {
      e && e.preventDefault();

      _this.props.form.validateFields(function (err, values) {
        if (!err) {
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

  IArchive.getDerivedStateFromProps = function (nextProps, prevState) {
    if (nextProps.dataSource !== prevState.dataSource) {
      return {
        dataSource: nextProps.dataSource
      };
    } else {
      return null;
    }
  };

  IArchive.prototype.getFieldValue = function (name, option, editable) {
    var value = this.state.dataSource[name] || option.value;

    if (this.props.formatter) {
      return this.props.formatter(value);
    } else {
      if (editable) {
        return option.renderInput ? option.renderInput(value, this.state.dataSource) : value;
      } else {
        return option.render ? option.render(value, this.state.dataSource) : value;
      }
    }
  };

  IArchive.prototype.getFieldInput = function (name, option) {
    var _this = this;

    var _a = this.props,
        form = _a.form,
        readonly = _a.readonly,
        onChange = _a.onChange;
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
          var v = customForm_1.CustomForm.getValueFromEvent(e, option);
          onChange(v, name);
          return v;
        };
      }

      decorator.defaultValue = this.getFieldValue(name, option, editable);
      var stateProps = option.getProps && option.getProps.call(this, this.props, this.state.dataSource, function (nextState) {
        _this.setState({
          dataSource: _extends({}, _this.state.dataSource, nextState)
        });
      }, this.props.form);
      if (stateProps === false) return null;
      var fieldInput = customForm_1.CustomForm.getFieldInput(option, option.props, stateProps || {}, decorator);
      return form.getFieldDecorator(name, decorator)(fieldInput);
    } else {
      return this.getFieldValue(name, option);
    }
  };

  IArchive.prototype.getFields = function () {
    var _a = this.props,
        options = _a.options,
        limit = _a.limit,
        cols = _a.cols,
        formItemLayout = _a.formItemLayout,
        compact = _a.compact,
        noLabel = _a.noLabel;
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

        if (input) {
          fields.push(React.createElement(col_1["default"], {
            span: item.col ? item.col * span : item.span || span,
            key: name,
            style: {
              display: i < count ? 'block' : 'none'
            }
          }, React.createElement(form_1["default"].Item, _extends({}, formItemLayout, item.attrs, {
            label: label,
            style: itemStyle
          }), input)));
        }
      }
    }

    return fields;
  };

  IArchive.prototype.getButtons = function () {
    var _a = this.props,
        buttons = _a.buttons,
        buttonProps = _a.buttonProps;

    if (buttonProps.onSubmit) {
      buttonProps.onSubmit.bind(this.state.dataSource);
    } else {
      buttonProps.onSubmit = this.handleSubmit;
    }

    var justify = buttonProps.align || 'end';

    var _buttons = customForm_1.CustomForm.getButtons(buttons, buttonProps);

    return _buttons ? React.createElement(row_1["default"], {
      justify: justify,
      type: "flex",
      className: "hc-archive-btns",
      style: buttonProps.btnStyle
    }, _buttons) : null;
  };

  IArchive.prototype.render = function () {
    return React.createElement(form_1["default"], {
      className: 'hc-archive ' + this.props.className,
      style: this.props.style,
      layout: this.props.layout,
      onSubmit: this.props.buttonProps.noButton && this.handleSubmit
    }, React.createElement(row_1["default"], {
      gutter: 24
    }, this.getFields(), this.props.limit && this.props.limit < this.props.options.length ? React.createElement("a", {
      className: "hc-archive-expand",
      onClick: this.toggle
    }, "more ", React.createElement(icon_1["default"], {
      type: this.state.expand ? 'up' : 'down'
    })) : null), this.getButtons());
  };

  IArchive.propTypes = {
    options: prop_types_1["default"].array,
    dataSource: prop_types_1["default"].object,
    limit: prop_types_1["default"].number,
    form: prop_types_1["default"].object,
    cols: prop_types_1["default"].number,
    readonly: prop_types_1["default"].bool,
    compact: prop_types_1["default"].bool,
    layout: prop_types_1["default"].string,
    formItemLayout: prop_types_1["default"].object,
    onChange: prop_types_1["default"].func,
    onSubmit: prop_types_1["default"].func,
    formatter: prop_types_1["default"].func,
    noLabel: prop_types_1["default"].bool,
    style: prop_types_1["default"].object,
    className: prop_types_1["default"].string,
    buttons: prop_types_1["default"].array,
    buttonProps: prop_types_1["default"].object
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
  return IArchive;
}(react_1["default"].PureComponent);

var ArchiveGroup =
/** @class */
function (_super) {
  __extends(ArchiveGroup, _super);

  function ArchiveGroup() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  ArchiveGroup.prototype.render = function () {
    var _this = this;

    return React.createElement("div", {
      className: "hc-archive-group"
    }, this.props.options.map(function (item) {
      return React.createElement("div", {
        key: item.name,
        className: "hc-archive-group_box"
      }, React.createElement("h5", null, item.title || item.name), React.createElement(divider_1["default"], null), React.createElement(exports.Archive, _extends({}, item.attrs, _this.props, {
        options: item.items,
        dataSource: _this.props.dataSource[item.name]
      })));
    }));
  };

  ArchiveGroup.propTypes = {
    options: prop_types_1["default"].array,
    dataSource: prop_types_1["default"].object
  };
  ArchiveGroup.defaultProps = {
    options: [],
    dataSource: {}
  };
  return ArchiveGroup;
}(react_1["default"].PureComponent);

exports.Archive = form_1["default"].create({
  name: 'archive'
})(IArchive);
exports.Archive.Group = ArchiveGroup;