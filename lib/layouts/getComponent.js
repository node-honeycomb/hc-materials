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

var hoist_non_react_statics_1 = require("hoist-non-react-statics");

function getComponent(option, getProps) {
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

  if (option && option.prototype && option.prototype.isReactComponent) {
    AppointComponent = option;
  } else {
    propValues = option || {};
  }

  var decorator = function decorator(BaseComponent) {
    AppointComponent = AppointComponent || BaseComponent || EmptyComponent;

    var Component =
    /** @class */
    function (_super) {
      __extends(Component, _super);

      function Component(props) {
        var _this = _super.call(this, props) || this;

        if (BaseComponent && !BaseComponent.prototype.isReactComponent) {
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

      Component.prototype.componentDidMount = function () {
        var _this = this;

        this.mounted = true;

        if (this._getComponent) {
          this._getComponent(this.context, function (err, component, props) {
            if (err) {
              window.console.error(err);
            } else {
              if (_this.mounted) {
                _this.setState({
                  stateProps: props || {},
                  Component: component
                });
              }
            }
          }, function (nextState) {
            return _this.setState({
              stateProps: _extends({}, _this.state.stateProps, nextState)
            });
          });
        }
      };

      Component.prototype.componentWillUnmount = function () {
        this.mounted = false;
      };

      Component.prototype.getRealInstance = function () {
        return this._wrappedComponent;
      };

      Component.prototype.render = function () {
        var _this = this;

        var _a = this.state,
            stateProps = _a.stateProps,
            Component = _a.Component;

        var newProps = _extends({}, propValues);

        for (var key in this.props) {
          if (newProps[key] === undefined) {
            newProps[key] = this.props[key];
          }
        }

        var asyncProps = getProps ? getProps(newProps, this.context, function (nextProps) {
          _this.setState({
            stateProps: _extends({}, _this.state.stateProps, nextProps)
          });
        }) : {};
        return React.createElement(Component, _extends({
          ref: function ref(inst) {
            return _this._wrappedComponent = inst;
          }
        }, newProps, asyncProps, stateProps));
      };

      return Component;
    }(react_1["default"].PureComponent);

    var newComponent = hoist_non_react_statics_1["default"](Component, AppointComponent);

    if (BaseComponent && BaseComponent.contextTypes) {
      newComponent.contextTypes = _extends(newComponent.contextTypes || {}, BaseComponent.contextTypes);
    }

    return newComponent;
  };

  return decorator;
}

exports.getComponent = getComponent;
/* eslint-disable react/prop-types */

function EmptyComponent(props) {
  return React.createElement("span", {
    id: props.id
  }, props.children);
}

getComponent.emptyComponent = EmptyComponent;