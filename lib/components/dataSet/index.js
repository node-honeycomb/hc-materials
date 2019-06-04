"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataSet = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DataSet =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(DataSet, _React$PureComponent);

  function DataSet(props, context) {
    var _this;

    _classCallCheck(this, DataSet);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DataSet).call(this, props, context));

    _this.handleResolve = function (value, params) {
      if (_this.props.loading) {
        _this.setState({
          loading: true
        });
      }

      if (_this.props.getResolver) {
        var resolver = _this.props.getResolver(value, params);

        resolver.then(function (iState) {
          if (_this.mounted) {
            iState.loading = false;

            _this.setState(iState, _this.props.onChange);
          }
        });
      }
    };

    _this.state = {
      loading: props.loading
    };
    _this.stateUpdater = {};

    if (props.getResolver) {
      _this._resolver = props.getResolver(props.defaultValue);
    }
    /**
     * prop = {
     *  value: Object | Function,
     *  format: String,
     *  formatter: Function,
     *  setter: String | Function
     * }
     */


    Object.keys(props.data).forEach(function (name) {
      var prop = props.data[name];

      if (prop.value) {
        var originValue = typeof prop.value === 'function' ? prop.value.call(_assertThisInitialized(_this), _this.props) : prop.value;

        var formatter = _this.getFormatter(props.formatter, name); // formatter是一系列解决组件schema的格式化函数


        if (formatter) {
          _this.state[name] = formatter.call(_assertThisInitialized(_this), prop.schema, originValue);
        } else {
          _this.state[name] = originValue;
        }
      }

      if (prop.setter) {
        var setter = props.childProps[prop.setter];

        _this.stateUpdater[prop.setter] = function (updateFn) {
          return _this.setState(function (prevState) {
            var newValue = typeof updateFn === 'function' ? updateFn.call(_assertThisInitialized(_this), prevState[name]) : updateFn;

            var formatter = _this.getFormatter(props.formatter, name);

            if (formatter) {
              newValue = formatter.call(_assertThisInitialized(_this), prop.schema, newValue);
            }

            setter && setter(newValue);
            return _defineProperty({}, name, newValue);
          });
        };
      }
    });
    return _this;
  }

  _createClass(DataSet, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.mounted = true;
      this._resolver && this._resolver.then(function (iState) {
        if (iState && _this2.mounted) {
          iState.loading = false;

          _this2.setState(iState, _this2.props.onChange);
        }
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mounted = false;
    }
  }, {
    key: "getFormatter",
    value: function getFormatter(formatter, name) {
      if (!formatter && DataSet.formatter) {
        var comFormatter = DataSet.formatter[this.props.format] || {};
        formatter = comFormatter[name];
      }

      return formatter;
    }
  }, {
    key: "getRealInstance",
    value: function getRealInstance() {
      return this._instance;
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props = this.props,
          children = _this$props.children,
          Component = _this$props.Component,
          childProps = _this$props.childProps;

      if (Component) {
        if (children) {
          return _react["default"].createElement(Component, _extends({
            ref: function ref(instance) {
              return _this3._instance = instance;
            }
          }, childProps, this.state, this.stateUpdater), children);
        } else {
          return _react["default"].createElement(Component, _extends({
            ref: function ref(instance) {
              return _this3._instance = instance;
            }
          }, childProps, this.state, this.stateUpdater));
        }
      } else {
        return _react["default"].cloneElement(_react["default"].Children.only(children), _extends({
          ref: function ref(instance) {
            _this3._instance = instance;

            if (typeof children.ref === 'function') {
              children.ref(instance);
            }
          }
        }, childProps, this.state, this.stateUpdater));
      }
    }
  }]);

  return DataSet;
}(_react["default"].PureComponent);

exports.DataSet = DataSet;
DataSet.formatter = {};
DataSet.propTypes = {
  Component: _propTypes["default"].any,
  childProps: _propTypes["default"].object,
  onChange: _propTypes["default"].object,
  value: _propTypes["default"].any,
  data: _propTypes["default"].object,
  getResolver: _propTypes["default"].func,
  defaultValue: _propTypes["default"].string,
  format: _propTypes["default"].string,
  formatter: _propTypes["default"].func,
  children: _propTypes["default"].any,
  loading: _propTypes["default"].bool
};
DataSet.defaultProps = {
  data: {},
  childProps: {}
};