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

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var prop_types_1 = require("prop-types");

var DataSet =
/** @class */
function (_super) {
  __extends(DataSet, _super);

  function DataSet(props, context) {
    var _this = _super.call(this, props, context) || this;

    _this.handleResolve = function (value, params) {
      if (_this.props.spin) {
        _this.setState({
          pending: true
        });
      }

      if (_this.props.getResolver) {
        var resolver = _this.props.getResolver(value, params);

        resolver.then(function (iState) {
          iState.pending = false;

          _this.setState(iState, _this.props.onChange);
        });
      }
    };

    _this.state = {
      pending: props.spin
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
      var originValue = typeof prop.value === 'function' ? prop.value.call(_this, _this.props) : prop.value;

      var formatter = _this.getFormatter(props.formatter, name); // formatter是一系列解决组件schema的格式化函数


      if (formatter) {
        _this.state[name] = formatter.call(_this, prop.schema, originValue);
      } else {
        _this.state[name] = originValue;
      }

      if (prop.setter) {
        _this.stateUpdater[prop.setter] = function (updateFn, callback) {
          return _this.setState(function (_a) {
            var stateName = _a.stateName;
            return function () {
              var newValue = typeof updateFn === 'function' ? updateFn.call(_this, stateName) : updateFn;

              var formatter = _this.getFormatter(props.formatter, name);

              if (formatter) {
                newValue = formatter.call(_this, prop.schema, newValue);
              }

              return newValue;
            };
          }, callback);
        };
      }
    });
    return _this;
  }

  DataSet.prototype.componentDidMount = function () {
    var _this = this;

    this._resolver && this._resolver.then(function (iState) {
      iState.pending = false;

      _this.setState(iState, _this.props.onChange);
    });
  };

  DataSet.prototype.getFormatter = function (formatter, name) {
    if (!formatter && DataSet.formatter) {
      var comFormatter = DataSet.formatter[this.props.format] || {};
      formatter = comFormatter[name];
    }

    return formatter;
  };

  DataSet.prototype.getRealInstance = function () {
    return this._instance;
  };

  DataSet.prototype.render = function () {
    var _this = this;

    var _a = this.props,
        children = _a.children,
        Component = _a.Component,
        childProps = _a.childProps;

    if (Component) {
      if (children) {
        return React.createElement(Component, _extends({
          ref: function ref(instance) {
            return _this._instance = instance;
          }
        }, childProps, this.state, this.stateUpdater), children);
      } else {
        return React.createElement(Component, _extends({
          ref: function ref(instance) {
            return _this._instance = instance;
          }
        }, childProps, this.state, this.stateUpdater));
      }
    } else {
      return react_1["default"].cloneElement(react_1["default"].Children.only(children), __assign({
        ref: function ref(instance) {
          _this._instance = instance;

          if (typeof children.ref === 'function') {
            children.ref(instance);
          }
        }
      }, childProps, this.state, this.stateUpdater));
    }
  };

  DataSet.formatter = {};
  DataSet.propTypes = {
    Component: prop_types_1["default"].any,
    childProps: prop_types_1["default"].object,
    onChange: prop_types_1["default"].object,
    value: prop_types_1["default"].any,
    data: prop_types_1["default"].object,
    getResolver: prop_types_1["default"].func,
    defaultValue: prop_types_1["default"].string,
    format: prop_types_1["default"].string,
    formatter: prop_types_1["default"].func,
    children: prop_types_1["default"].any,
    spin: prop_types_1["default"].bool
  };
  DataSet.defaultProps = {
    data: {},
    childProps: {}
  };
  return DataSet;
}(react_1["default"].PureComponent);

exports.DataSet = DataSet;