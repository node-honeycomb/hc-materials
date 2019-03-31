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

var card_1 = require("antd/lib/card"); // 有点问题


var types = ['hc', 'custom', 'antd', 'material']; // https://github.com/swagger-api/swagger-editor/blob/2cc957f755a72fcc005c084f689810ce468d2571/src/plugins/editor/components/editor.jsx

var LayerGrid =
/** @class */
function (_super) {
  __extends(LayerGrid, _super);

  function LayerGrid() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  LayerGrid.prototype.render = function () {
    return React.createElement("div", {
      className: this.props.className,
      style: this.props.style
    }, this.props.children);
  };

  LayerGrid.propTypes = {
    className: prop_types_1["default"].string,
    children: prop_types_1["default"].any,
    style: prop_types_1["default"].object
  };
  return LayerGrid;
}(react_1["default"].PureComponent);

exports.LayerGrid = LayerGrid;
var __guid__ = 1;

function guid(prefix) {
  return prefix + __guid__++;
}

function wrapper(_a) {
  var children = _a.children;
  return children;
}

var LayerItem =
/** @class */
function (_super) {
  __extends(LayerItem, _super);

  function LayerItem(props, context) {
    var _this = _super.call(this, props) || this;

    _this.state = {
      active: false,
      guid: guid('layerItem')
    };
    context.layer.register(_this.state.guid, function (active) {
      _this.setState({
        active: active
      });
    });
    return _this;
  }

  LayerItem.prototype.render = function () {
    var _this = this;

    var layer = this.context.layer; // const ItemWrapper = layer.isEditable() ? DropItem : wrapper;

    var ItemWrapper = wrapper;
    var _a = this.props,
        title = _a.title,
        children = _a.children,
        disabled = _a.disabled,
        onChange = _a.onChange,
        cardProps = _a.cardProps,
        menu = _a.menu;
    return React.createElement(card_1["default"], _extends({
      className: 'hc-editor-layerItem ' + (this.state.active ? 'active' : ''),
      onClick: function onClick() {
        layer.handleActive(_this.state.guid);
      },
      style: this.props.style,
      title: title,
      extra: disabled || !layer.isEditable() ? null : menu
    }, cardProps), React.createElement(ItemWrapper, {
      types: types,
      doAction: function doAction(type, item) {
        var target = {
          id: _this.state.guid,
          key: 'update',
          type: type,
          attrs: item.attrs
        };
        onChange && onChange(target);
      }
    }, children));
  };

  LayerItem.contextTypes = {
    layer: prop_types_1["default"].object
  };
  LayerItem.propTypes = {
    title: prop_types_1["default"].string,
    disabled: prop_types_1["default"].bool,
    children: prop_types_1["default"].element,
    onChange: prop_types_1["default"].func,
    cardProps: prop_types_1["default"].object,
    style: prop_types_1["default"].object,
    menu: prop_types_1["default"].any
  };
  LayerItem.defaultProps = {
    cardProps: {}
  };
  return LayerItem;
}(react_1["default"].PureComponent);

exports.LayerItem = LayerItem;