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

import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
/* eslint-disable new-cap */

var DropItem =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(DropItem, _React$PureComponent);

  function DropItem() {
    _classCallCheck(this, DropItem);

    return _possibleConstructorReturn(this, _getPrototypeOf(DropItem).apply(this, arguments));
  }

  _createClass(DropItem, [{
    key: "render",
    value: function render() {
      var className = this.props.className;

      if (this.props.canDrop) {
        className += ' j-com-drop';
      }

      if (this.props.isOver) {
        className += ' j-com-drop-over';
      }

      return this.props.connectDropTarget(React.createElement("div", _extends({
        className: className,
        style: this.props.style
      }, this.props.htmlFor), this.props.children));
    }
  }]);

  return DropItem;
}(React.PureComponent);

DropItem.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  types: PropTypes.array.isRequired,
  doAction: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func,
  canDrop: PropTypes.bool,
  isOver: PropTypes.bool,
  children: PropTypes.any,
  htmlFor: PropTypes.object
};
DropItem.defaultProps = {
  className: '',
  htmlFor: {}
};
DropItem = __decorate([DropTarget(function (props) {
  return props.types;
}, {
  drop: function drop(props, monitor) {
    var type = monitor.getItemType();
    var data = monitor.getItem().data;
    monitor.targetProps = props;

    if (props.types.indexOf(type) > -1) {
      props.doAction(type, data, monitor);
    } else {
      props.doAction(type, data, monitor);
    }
  }
}, function (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
})], DropItem);
export { DropItem };