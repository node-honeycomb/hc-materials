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

var SimpleLayer =
/** @class */
function (_super) {
  __extends(SimpleLayer, _super);

  function SimpleLayer() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  SimpleLayer.prototype.render = function () {
    var _a = this.props,
        components = _a.components,
        LayerItem = _a.LayerItem,
        LayerGrid = _a.LayerGrid,
        style = _a.style;
    return React.createElement(LayerGrid, {
      className: "hc-layer hc-layer-simple",
      style: style
    }, components.map(function (item, index) {
      return React.createElement(LayerItem, _extends({
        key: item.key || index
      }, item.attrs, {
        className: "hc-layer-elem_box"
      }), item && item.component ? React.createElement(item.component, null) : null);
    }));
  };

  SimpleLayer.propTypes = {
    components: prop_types_1["default"].array,
    LayerItem: prop_types_1["default"].any,
    LayerGrid: prop_types_1["default"].any,
    style: prop_types_1["default"].object
  };
  return SimpleLayer;
}(react_1["default"].PureComponent);

exports.SimpleLayer = SimpleLayer;