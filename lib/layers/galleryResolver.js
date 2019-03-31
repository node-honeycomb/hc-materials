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

var upperFirst_1 = require("lodash/upperFirst");

var getComponent_1 = require("../layouts/getComponent");

var layerConvertor_1 = require("./layerConvertor");

var hcGetComponent = getComponent_1.getComponent;
exports.gallery = {
  layouts: {
    name: 'layout',
    items: {}
  },
  services: {
    name: 'service',
    items: {}
  },
  layers: {
    name: 'layer',
    items: {}
  },
  components: {
    name: 'component',
    items: {
      custom: {
        name: 'custom',
        items: {}
      },
      hc: {
        name: 'hc',
        items: {}
      },
      antd: {
        name: 'antd',
        items: {}
      },
      material: {
        name: 'material',
        items: {}
      }
    }
  }
};

function findComponent() {
  var _a;

  var args = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }

  var cname;
  var componentType;
  var component;
  var getComponent;
  var contextTypes;
  var hoc;
  var props;
  var getProps;
  var galleryType;
  var original;

  if (Object(args[0]) === args[0]) {
    _a = args[0], cname = _a.cname, componentType = _a.componentType, component = _a.component, props = _a.props, getProps = _a.getProps, getComponent = _a.getComponent, contextTypes = _a.contextTypes, hoc = _a.hoc;
    original = args[1];
    galleryType = args[2];
  } else {
    cname = args[0], componentType = args[1], component = args[2], props = args[3], getProps = args[4], getComponent = args[5], contextTypes = args[6], hoc = args[7], original = args[8], galleryType = args[9];
  }

  var decorative = !original;
  var componentList = galleryType ? exports.gallery[galleryType] : exports.gallery.components.items[componentType] || exports.gallery.components.items['custom'];
  var newComponent;
  var async;

  if (getComponent) {
    newComponent = layerConvertor_1.converter.parse(getComponent);
    async = true;
    newComponent._async = async;
  } else {
    if (typeof component === 'function') {
      // 本身就是组件
      newComponent = component;
    } else if (cname) {
      /**
       * com = {
       *  componentType: [antd|custom|hc|material],
       *  cname: 'x',
       *  props: {
       *    ...
       *  }
       * }
       */
      var cs = cname.split('.');
      newComponent = componentList.items[cs.shift()]; // Button.Group

      while (newComponent && cs.length) {
        newComponent = newComponent[cs.shift()];
      }
    }
  }

  if (newComponent) {
    var newContextTypes_1 = {};

    if (contextTypes) {
      contextTypes.forEach(function (name) {
        newContextTypes_1[name] = prop_types_1["default"].any;
      });

      if (newComponent.contextTypes) {
        _extends(newComponent.contextTypes, newContextTypes_1);
      } else {
        newComponent.contextTypes = newContextTypes_1;
      }
    }

    if (decorative) {
      if (async) {
        props = props || {};
      }

      newComponent = hcGetComponent(props, layerConvertor_1.converter.parse(getProps))(newComponent);
    } // 一般来说和view不能共用


    if (hoc) {
      var Com_1 = findComponent(hoc);

      if (!Com_1) {
        window.console.log('hoc组件丢失');
      }

      var ChildComponent = newComponent;
      var childProps_1 = hoc.childProps || {};

      var HocComponent =
      /** @class */
      function (_super) {
        __extends(HocComponent, _super);

        function HocComponent() {
          return _super !== null && _super.apply(this, arguments) || this;
        }

        HocComponent.prototype.render = function () {
          var children = React.createElement(Com_1, null, React.createElement(newComponent.ChildComponent, _extends({}, childProps_1, this.props))); // #! 包裹

          var wrapper = layerConvertor_1.converter.parse(hoc.wrapper);

          if (wrapper) {
            return wrapper(children);
          } else {
            return children;
          }
        };

        return HocComponent;
      }(react_1["default"].PureComponent);

      newComponent = HocComponent;
      newComponent.ChildComponent = ChildComponent;
      newComponent._async = ChildComponent._async;
    }
  }

  return newComponent;
}

exports.findComponent = findComponent;

exports.findService = function (name) {
  return exports.gallery.services.items[name];
};

function setGallery(aGallery) {
  for (var key in aGallery) {
    if (key === 'components') {
      for (var ikey in aGallery[key]) {
        window[upperFirst_1["default"](ikey)] = aGallery[key][ikey];

        _extends(exports.gallery[key].items[ikey].items, aGallery[key][ikey]);
      }
    } else {
      _extends(exports.gallery[key].items, aGallery[key]);
    }
  }
}

exports.setGallery = setGallery;