"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getComponent = getComponent;

var _react = _interopRequireDefault(require("react"));

var _hoistNonReactStatics = _interopRequireDefault(require("hoist-non-react-statics"));

var _isReactComponent = _interopRequireDefault(require("../core/isReactComponent"));

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

function getComponent(option, getProps, contextTypes) {
  if (option === false) {
    return function () {
      return EmptyComponent;
    };
  } else if (!option && !getProps) {
    return function (BaseComponent) {
      return BaseComponent;
    };
  }

  var AppointComponent;
  var propValues = {};

  if (option && typeof option === 'function') {
    AppointComponent = option;
  } else {
    propValues = option || {};
  }

  var decorator = function decorator(BaseComponent) {
    AppointComponent = AppointComponent || BaseComponent || EmptyComponent;

    var Component =
    /*#__PURE__*/
    function (_React$PureComponent) {
      _inherits(Component, _React$PureComponent);

      function Component(props) {
        var _this;

        _classCallCheck(this, Component);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(Component).call(this, props));

        if (BaseComponent && !(0, _isReactComponent["default"])(BaseComponent)) {
          _this.state = {
            stateProps: {},
            Component: EmptyComponent
          };
          _this._getComponent = BaseComponent;
        } else {
          _this.state = {
            stateProps: {},
            Component: AppointComponent
          };
        }

        return _this;
      }

      _createClass(Component, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          var _this2 = this;

          this.mounted = true;

          if (this._getComponent) {
            this._getComponent(this.context, function (err, component, props) {
              if (err) {
                window.console.error(err);
              } else {
                if (_this2.mounted) {
                  _this2.setState({
                    stateProps: props || {},
                    Component: component
                  });
                }
              }
            }, function (nextState) {
              return _this2.setState({
                stateProps: _extends({}, _this2.state.stateProps, nextState)
              });
            });
          }
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          this.mounted = false;
        }
      }, {
        key: "getRealInstance",
        value: function getRealInstance() {
          return this._wrappedComponent;
        }
      }, {
        key: "render",
        value: function render() {
          var _this3 = this;

          var _this$state = this.state,
              stateProps = _this$state.stateProps,
              Component = _this$state.Component;

          var newProps = _extends({}, propValues);

          for (var key in this.props) {
            if (newProps[key] === undefined) {
              newProps[key] = this.props[key];
            }
          }

          var asyncProps = getProps ? getProps(newProps, this.context, function (nextProps) {
            _this3.setState({
              stateProps: _extends({}, _this3.state.stateProps, nextProps)
            });
          }, this.state.stateProps) : {};
          return _react["default"].createElement(Component, _extends({
            ref: function ref(inst) {
              return _this3._wrappedComponent = inst;
            }
          }, newProps, asyncProps, stateProps));
        }
      }]);

      return Component;
    }(_react["default"].PureComponent);

    Component.contextTypes = contextTypes;
    var newComponent = (0, _hoistNonReactStatics["default"])(Component, AppointComponent);
    newComponent.displayName = AppointComponent.displayName;

    if (BaseComponent && BaseComponent.contextTypes) {
      newComponent.contextTypes = _extends(newComponent.contextTypes || {}, BaseComponent.contextTypes);
    }

    return newComponent;
  };

  return decorator;
}
/* eslint-disable react/prop-types */


function EmptyComponent(props) {
  return _react["default"].createElement("span", {
    id: props.id
  }, props.children);
}

getComponent.emptyComponent = EmptyComponent;