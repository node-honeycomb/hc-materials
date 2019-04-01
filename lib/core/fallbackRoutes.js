"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fallbackRoutes = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _bootstrap = require("./bootstrap");

var _reactRouterDom = require("react-router-dom");

var _exception = require("../components/exception");

var _localeContext = require("./localeContext");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var exceptions = {
  403: {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/wZcnGqRDyhPOEYFcZDnb.svg',
    title: '403'
  },
  404: {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg',
    title: '404'
  },
  500: {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/RVRUAYdCGeYNBWoKiIwB.svg',
    title: '500'
  }
};

var ExceptionScene =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(ExceptionScene, _React$PureComponent);

  function ExceptionScene() {
    _classCallCheck(this, ExceptionScene);

    return _possibleConstructorReturn(this, _getPrototypeOf(ExceptionScene).apply(this, arguments));
  }

  _createClass(ExceptionScene, [{
    key: "render",
    value: function render() {
      var _this = this;

      var locale = this.getLocale();
      var links = [{
        type: 'primary',
        size: 'large',
        name: locale.backToHome,
        action: function action() {
          _reactRouterDom.browserHistory.replace(_this.context.app.route(_bootstrap.bootstrap.getPrefix(_this.context.app)).resolvePath);
        }
      }];
      var data = exceptions[this.props.route.exception || 404];
      data.desc = locale[data.title];
      return _react["default"].createElement(_exception.Exception, {
        data: data,
        style: {
          minHeight: 500,
          height: '80%'
        },
        links: links
      });
    }
  }]);

  return ExceptionScene;
}(_react["default"].PureComponent);

ExceptionScene.contextTypes = {
  app: _propTypes["default"].object
};
ExceptionScene.propTypes = {
  route: _propTypes["default"].object
};
ExceptionScene = __decorate([(0, _localeContext.localeContext)('Exception')], ExceptionScene);
var fallbackRoutes = [{
  name: 'noAuth',
  component: ExceptionScene,
  hide: true,
  exception: 403
}, {
  name: 'error',
  component: ExceptionScene,
  hide: true,
  exception: 500
}, {
  path: '*',
  resolvePath: '*',
  component: ExceptionScene,
  hide: true,
  exception: 404
}];
exports.fallbackRoutes = fallbackRoutes;