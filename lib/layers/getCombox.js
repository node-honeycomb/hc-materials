"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCombox = getCombox;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _getComponent = require("../layouts/getComponent");

var _layerConvertor = require("./layerConvertor");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function getCombox(_ref, findComponent) {
  var cname = _ref.cname,
      componentType = _ref.componentType,
      props = _ref.props,
      getProps = _ref.getProps,
      hoc = _ref.hoc,
      className = _ref.className,
      contextTypes = _ref.contextTypes;

  var Combox =
  /*#__PURE__*/
  function (_React$PureComponent) {
    _inherits(Combox, _React$PureComponent);

    function Combox(tprops, context) {
      var _this;

      _classCallCheck(this, Combox);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Combox).call(this, tprops));

      var _getProps = _layerConvertor.converter.parse(getProps);

      var propsMap = _getProps ? _getProps.call(_assertThisInitialized(_this), tprops, context, function (nextState) {
        return _this.setState(nextState);
      }, _this.state) : props || {};
      _this.state = {
        components: cname.map(function (n) {
          var item = propsMap[n];
          item.cname = item.cname || n;
          item.componentType = item.componentType || componentType;
          var Component;

          if (Array.isArray(item.cname)) {
            Component = getCombox(item, findComponent, function () {
              return Component.contextTypes;
            });
          } else {
            Component = findComponent(item) || _getComponent.getComponent.emptyComponent;
          }

          return {
            Component: Component,
            key: n
          };
        })
      };
      return _this;
    }

    _createClass(Combox, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        return _react["default"].createElement("div", {
          className: 'hc-combox ' + (className || '')
        }, this.state.components.map(function (item) {
          return _react["default"].createElement(item.Component, _extends({
            key: item.key
          }, _this2.props));
        }));
      }
    }]);

    return Combox;
  }(_react["default"].PureComponent);

  if (contextTypes) {
    Combox.contextTypes = {};
    contextTypes.forEach(function (name) {
      Combox.contextTypes[name] = _propTypes["default"].object;
    });
  }

  if (hoc) {
    var Com = findComponent(hoc);

    if (!Com) {
      window.console.log('hoc组件丢失');
    }

    var ChildComponent = Combox;
    var childProps = hoc.childProps || {};

    var HocCombox =
    /*#__PURE__*/
    function (_React$PureComponent2) {
      _inherits(HocCombox, _React$PureComponent2);

      function HocCombox() {
        _classCallCheck(this, HocCombox);

        return _possibleConstructorReturn(this, _getPrototypeOf(HocCombox).apply(this, arguments));
      }

      _createClass(HocCombox, [{
        key: "render",
        value: function render() {
          var children = _react["default"].createElement(Com, null, _react["default"].createElement(HocCombox.ChildComponent, _extends({}, childProps, this.props))); // #! 包裹


          var wrapper = _layerConvertor.converter.parse(hoc.wrapper);

          if (wrapper) {
            return wrapper(children);
          } else {
            return children;
          }
        }
      }]);

      return HocCombox;
    }(_react["default"].PureComponent);

    HocCombox.ChildComponent = ChildComponent;
    HocCombox._async = ChildComponent._async;
    return HocCombox;
  } else {
    return Combox;
  }
}