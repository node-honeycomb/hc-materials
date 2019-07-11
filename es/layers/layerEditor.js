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

import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd'; // 有点问题

var types = ['hc', 'custom', 'antd', 'material']; // https://github.com/swagger-api/swagger-editor/blob/2cc957f755a72fcc005c084f689810ce468d2571/src/plugins/editor/components/editor.jsx

export var LayerGrid =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(LayerGrid, _React$PureComponent);

  function LayerGrid() {
    _classCallCheck(this, LayerGrid);

    return _possibleConstructorReturn(this, _getPrototypeOf(LayerGrid).apply(this, arguments));
  }

  _createClass(LayerGrid, [{
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: this.props.className,
        style: this.props.style
      }, this.props.children);
    }
  }]);

  return LayerGrid;
}(React.PureComponent);
LayerGrid.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
  style: PropTypes.object
};
var __guid__ = 1;

function guid(prefix) {
  return prefix + __guid__++;
}

function wrapper(_ref) {
  var children = _ref.children;
  return children;
}

export var LayerItem =
/*#__PURE__*/
function (_React$PureComponent2) {
  _inherits(LayerItem, _React$PureComponent2);

  function LayerItem(props, context) {
    var _this;

    _classCallCheck(this, LayerItem);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LayerItem).call(this, props));
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

  _createClass(LayerItem, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var layer = this.context.layer; // const ItemWrapper = layer.isEditable() ? DropItem : wrapper;

      var ItemWrapper = wrapper;
      var _this$props = this.props,
          title = _this$props.title,
          children = _this$props.children,
          disabled = _this$props.disabled,
          onChange = _this$props.onChange,
          cardProps = _this$props.cardProps,
          menu = _this$props.menu;
      return React.createElement(Card, _extends({
        className: 'hc-editor-layerItem ' + (this.state.active ? 'active' : ''),
        onClick: function onClick() {
          layer.handleActive(_this2.state.guid);
        },
        style: this.props.style,
        title: title,
        extra: disabled || !layer.isEditable() ? null : menu
      }, cardProps), React.createElement(ItemWrapper, {
        types: types,
        doAction: function doAction(type, item) {
          var target = {
            id: _this2.state.guid,
            key: 'update',
            type: type,
            attrs: item.attrs
          };
          onChange && onChange(target);
        }
      }, children));
    }
  }]);

  return LayerItem;
}(React.PureComponent);
LayerItem.contextTypes = {
  layer: PropTypes.object
};
LayerItem.propTypes = {
  title: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.element,
  onChange: PropTypes.func,
  cardProps: PropTypes.object,
  style: PropTypes.object,
  menu: PropTypes.any
};
LayerItem.defaultProps = {
  cardProps: {}
};