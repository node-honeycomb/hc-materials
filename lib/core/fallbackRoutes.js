"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var prop_types_1 = require("prop-types");

var bootstrap_1 = require("./bootstrap");

var react_router_dom_1 = require("react-router-dom");

var exception_1 = require("../components/exception");

var localeContext_1 = require("./localeContext");

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
/** @class */
function (_super) {
  __extends(ExceptionScene, _super);

  function ExceptionScene() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  ExceptionScene.prototype.render = function () {
    var _this = this;

    var locale = this.getLocale();
    var links = [{
      type: 'primary',
      size: 'large',
      name: locale.backToHome,
      action: function action() {
        react_router_dom_1.browserHistory.replace(_this.context.app.route(bootstrap_1.bootstrap.getPrefix(_this.context.app)).resolvePath);
      }
    }];
    var data = exceptions[this.props.route.exception || 404];
    data.desc = locale[data.title];
    return React.createElement(exception_1.Exception, {
      data: data,
      style: {
        minHeight: 500,
        height: '80%'
      },
      links: links
    });
  };

  ExceptionScene.contextTypes = {
    app: prop_types_1["default"].object
  };
  ExceptionScene.propTypes = {
    route: prop_types_1["default"].object
  };
  ExceptionScene = __decorate([localeContext_1.localeContext('Exception')], ExceptionScene);
  return ExceptionScene;
}(react_1["default"].PureComponent);

exports.fallbackRoutes = [{
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