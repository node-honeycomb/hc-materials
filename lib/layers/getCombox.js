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

var getComponent_1 = require("../layouts/getComponent");

var layerConvertor_1 = require("./layerConvertor");

function getCombox(_a, findComponent) {
  var cname = _a.cname,
      componentType = _a.componentType,
      props = _a.props,
      getProps = _a.getProps,
      hoc = _a.hoc,
      className = _a.className;

  var Combox =
  /** @class */
  function (_super) {
    __extends(Combox, _super);

    function Combox(tprops, context) {
      var _this = _super.call(this, tprops) || this;

      var _getProps = layerConvertor_1.converter.parse(getProps);

      var propsMap = _getProps ? _getProps.call(_this, tprops, context) : props || {};
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
            Component = findComponent(item) || getComponent_1.getComponent.emptyComponent;
          }

          return {
            Component: Component,
            key: n
          };
        })
      };
      return _this;
    }

    Combox.prototype.render = function () {
      var _this = this;

      return React.createElement("div", {
        className: 'hc-combox ' + (className || '')
      }, this.state.components.map(function (item) {
        return React.createElement(item.Component, _extends({
          key: item.key
        }, _this.props));
      }));
    };

    return Combox;
  }(react_1["default"].PureComponent);

  if (hoc) {
    var Com_1 = findComponent(hoc);

    if (!Com_1) {
      window.console.log('hoc组件丢失');
    }

    var ChildComponent = Combox;
    var childProps_1 = hoc.childProps || {};

    var HocCombox_1 =
    /** @class */
    function (_super) {
      __extends(HocCombox, _super);

      function HocCombox() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      HocCombox.prototype.render = function () {
        var children = React.createElement(Com_1, null, React.createElement(HocCombox.ChildComponent, _extends({}, childProps_1, this.props))); // #! 包裹

        var wrapper = layerConvertor_1.converter.parse(hoc.wrapper);

        if (wrapper) {
          return wrapper(children);
        } else {
          return children;
        }
      };

      return HocCombox;
    }(react_1["default"].PureComponent);

    HocCombox_1.ChildComponent = ChildComponent;
    HocCombox_1._async = ChildComponent._async;
    return HocCombox_1;
  } else {
    return Combox;
  }
}

exports.getCombox = getCombox;