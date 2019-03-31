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

var getComponent_1 = require("./getComponent");

function loop(arrOrMap, callback) {
  if (Array.isArray(arrOrMap)) {
    arrOrMap.forEach(callback);
  } else {
    for (var key in arrOrMap) {
      var item = arrOrMap[key];
      var newItem = {
        key: key
      };

      if (typeof item === 'function') {
        if (item.prototype && item.prototype.isReactComponent) {
          newItem.component = item;
        } else {
          newItem.getProps = item;
        }
      } else if (item === false) {
        newItem.props = false;
      } else {
        _extends(newItem, item);
      }

      callback(newItem);
    }
  }
}

var BasicLayout =
/** @class */
function (_super) {
  __extends(BasicLayout, _super);

  function BasicLayout() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  BasicLayout.prototype.getComponent = function (name) {
    return this.props.components[name] || getComponent_1.getComponent.emptyComponent;
  };

  BasicLayout.prototype.hasComponent = function (name) {
    return this.props.components[name] && this.props.components[name] !== getComponent_1.getComponent.emptyComponent;
  };

  BasicLayout.getLayoutProps = function (option, viewContent) {
    option.__widgets__ = option.__widgets__ || {};

    var layoutProps = _extends({
      route: option.route,
      viewContent: viewContent,
      components: _extends({}, option.__widgets__),
      style: option.style
    }, option.props);

    var layoutBlocks = _extends({}, this.layoutBlocks);

    loop(option.components, function (item) {
      var Com = item.component || layoutBlocks[item.key];

      if (Com) {
        delete item.component;
        delete layoutBlocks[item.key];
        layoutProps.components[item.key] = layoutProps.components[item.key] || getComponent_1.getComponent(item.props, item.getProps)(Com);

        if (item.props && item["static"]) {
          option.__widgets__[item.key] = layoutProps.components[item.key];
        }
      }
    });

    for (var name_1 in layoutBlocks) {
      layoutProps.components[name_1] = layoutProps.components[name_1];

      if (layoutBlocks[name_1].props && layoutBlocks[name_1]["static"]) {
        option.__widgets__[name_1] = layoutProps.components[name_1];
      }
    }

    var customLayoutProps = this.displayName && option[this.displayName];

    for (var key in customLayoutProps) {
      if (key === 'components') {
        _extends(layoutProps.components, customLayoutProps[key]);
      } else {
        layoutProps[key] = customLayoutProps[key];
      }
    }

    return layoutProps;
  };

  BasicLayout.propTypes = {
    className: prop_types_1["default"].string,
    components: prop_types_1["default"].object,
    viewContent: prop_types_1["default"].element,
    children: prop_types_1["default"].element,
    style: prop_types_1["default"].object
  };
  BasicLayout.defaultProps = {
    className: '',
    components: {}
  };
  return BasicLayout;
}(react_1["default"].PureComponent);

exports.BasicLayout = BasicLayout;