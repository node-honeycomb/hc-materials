"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DropItem", {
  enumerable: true,
  get: function get() {
    return _dropItem.DropItem;
  }
});
Object.defineProperty(exports, "DragItem", {
  enumerable: true,
  get: function get() {
    return _dragItem.DragItem;
  }
});
exports.DnDContext = void 0;

var _hoistNonReactStatics = _interopRequireDefault(require("hoist-non-react-statics"));

var _reactDndHtml5Backend = _interopRequireDefault(require("react-dnd-html5-backend"));

var _reactDnd = require("react-dnd");

var _dropItem = require("./dropItem");

var _dragItem = require("./dragItem");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable new-cap */
var DnDContext = function DnDContext() {
  return function (BaseComponent) {
    var Component = (0, _reactDnd.DragDropContext)(_reactDndHtml5Backend["default"])(BaseComponent);
    return (0, _hoistNonReactStatics["default"])(Component, BaseComponent);
  };
};

exports.DnDContext = DnDContext;