function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import PropTypes from 'prop-types';
import upperFirst from 'lodash/upperFirst';
import { getComponent } from '../layouts/getComponent';
import { converter } from './layerConvertor';
var hcGetComponent = getComponent;
export var gallery = {
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
export function findComponent() {
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

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (Object(args[0]) === args[0]) {
    var _args$ = args[0];
    cname = _args$.cname;
    componentType = _args$.componentType;
    component = _args$.component;
    props = _args$.props;
    getProps = _args$.getProps;
    getComponent = _args$.getComponent;
    contextTypes = _args$.contextTypes;
    hoc = _args$.hoc;
    original = args[1];
    galleryType = args[2];
  } else {
    cname = args[0];
    componentType = args[1];
    component = args[2];
    props = args[3];
    getProps = args[4];
    getComponent = args[5];
    contextTypes = args[6];
    hoc = args[7];
    original = args[8];
    galleryType = args[9];
  }

  var decorative = !original;
  var componentList = galleryType ? gallery[galleryType] : gallery.components.items[componentType] || gallery.components.items['custom'];
  var newComponent;
  var async;

  if (getComponent) {
    newComponent = converter.parse(getComponent);
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
    var newContextTypes = {};

    if (contextTypes) {
      contextTypes.forEach(function (name) {
        newContextTypes[name] = PropTypes.any;
      });

      if (newComponent.contextTypes) {
        _extends(newComponent.contextTypes, newContextTypes);
      } else {
        newComponent.contextTypes = newContextTypes;
      }
    }

    if (decorative) {
      if (async) {
        props = props || {};
      }

      newComponent = hcGetComponent(props, converter.parse(getProps))(newComponent);
    } // 一般来说和view不能共用


    if (hoc) {
      var Com = findComponent(hoc);

      if (!Com) {
        window.console.log('hoc组件丢失');
      }

      var ChildComponent = newComponent;
      var childProps = hoc.childProps || {};

      var HocComponent =
      /*#__PURE__*/
      function (_React$PureComponent) {
        _inherits(HocComponent, _React$PureComponent);

        function HocComponent() {
          _classCallCheck(this, HocComponent);

          return _possibleConstructorReturn(this, _getPrototypeOf(HocComponent).apply(this, arguments));
        }

        _createClass(HocComponent, [{
          key: "render",
          value: function render() {
            var children = React.createElement(Com, null, React.createElement(newComponent.ChildComponent, _extends({}, childProps, this.props))); // #! 包裹

            var wrapper = converter.parse(hoc.wrapper);

            if (wrapper) {
              return wrapper(children);
            } else {
              return children;
            }
          }
        }]);

        return HocComponent;
      }(React.PureComponent);

      newComponent = HocComponent;
      newComponent.ChildComponent = ChildComponent;
      newComponent._async = ChildComponent._async;
    }
  }

  return newComponent;
}
export var findService = function findService(name) {
  return gallery.services.items[name];
};
export function setGallery(aGallery) {
  for (var key in aGallery) {
    if (key === 'components') {
      for (var ikey in aGallery[key]) {
        window[upperFirst(ikey)] = aGallery[key][ikey];

        _extends(gallery[key].items[ikey].items, aGallery[key][ikey]);
      }
    } else {
      _extends(gallery[key].items, aGallery[key]);
    }
  }
}