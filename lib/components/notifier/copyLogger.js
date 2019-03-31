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

var clipboard_1 = require("clipboard");

var message_1 = require("antd/lib/message");

var button_1 = require("antd/lib/button");

var localeContext_1 = require("../../core/localeContext");

var CopyLogger =
/** @class */
function (_super) {
  __extends(CopyLogger, _super);

  function CopyLogger() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this._triggerRef = react_1["default"].createRef();
    return _this;
  }

  CopyLogger.prototype.componentDidMount = function () {
    var _this = this;
    /**
     * copy:
     * see: https://clipboardjs.com/
     */


    this._clipboard = new clipboard_1["default"](this._triggerRef.current);

    this._clipboard.on('success', function (e) {
      message_1["default"].info(_this.getLocale().copySuccess);
      e.clearSelection();
    });
  };

  CopyLogger.prototype.componentWillUnmount = function () {
    this._clipboard.destroy();
  };

  CopyLogger.prototype.render = function () {
    var inlineStyle = {
      marginRight: '40px',
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      wordBreak: 'break-all',
      lineHeight: '22px'
    };
    return React.createElement("div", {
      style: {
        whiteSpace: 'nowrap'
      }
    }, React.createElement(button_1["default"], {
      style: {
        "float": 'right'
      },
      ref: this._triggerRef,
      size: "small",
      type: "ghost",
      "data-clipboard-text": this.props.rid
    }, this.getLocale().copy), React.createElement("span", {
      style: inlineStyle
    }, this.props.message));
  };

  CopyLogger.propTypes = {
    rid: prop_types_1["default"].string,
    message: prop_types_1["default"].string
  };
  CopyLogger = __decorate([localeContext_1.localeContext('CopyLogger')], CopyLogger);
  return CopyLogger;
}(react_1["default"].PureComponent);

exports.CopyLogger = CopyLogger;