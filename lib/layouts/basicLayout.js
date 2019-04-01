"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BasicLayout = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _getComponent2 = require("./getComponent");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(BasicLayout, _React$PureComponent);

  function BasicLayout() {
    _classCallCheck(this, BasicLayout);

    return _possibleConstructorReturn(this, _getPrototypeOf(BasicLayout).apply(this, arguments));
  }

  _createClass(BasicLayout, [{
    key: "getComponent",
    value: function getComponent(name) {
      return this.props.components[name] || _getComponent2.getComponent.emptyComponent;
    }
  }, {
    key: "hasComponent",
    value: function hasComponent(name) {
      return this.props.components[name] && this.props.components[name] !== _getComponent2.getComponent.emptyComponent;
    }
  }]);

  return BasicLayout;
}(_react["default"].PureComponent);

exports.BasicLayout = BasicLayout;

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
      layoutProps.components[item.key] = layoutProps.components[item.key] || (0, _getComponent2.getComponent)(item.props, item.getProps)(Com);

      if (item.props && item["static"]) {
        option.__widgets__[item.key] = layoutProps.components[item.key];
      }
    }
  });

  for (var name in layoutBlocks) {
    layoutProps.components[name] = layoutProps.components[name];

    if (layoutBlocks[name].props && layoutBlocks[name]["static"]) {
      option.__widgets__[name] = layoutProps.components[name];
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
  className: _propTypes["default"].string,
  components: _propTypes["default"].object,
  viewContent: _propTypes["default"].element,
  children: _propTypes["default"].element,
  style: _propTypes["default"].object
};
BasicLayout.defaultProps = {
  className: '',
  components: {}
};