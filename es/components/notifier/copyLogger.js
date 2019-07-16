function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

import React from 'react';
import PropTypes from 'prop-types';
import Clipboard from 'clipboard';
import { Button, message } from 'antd';
import { localeContext } from '../../core/localeContext';

var CopyLogger =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(CopyLogger, _React$PureComponent);

  function CopyLogger() {
    var _this;

    _classCallCheck(this, CopyLogger);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CopyLogger).apply(this, arguments));
    _this._triggerRef = React.createRef();
    return _this;
  }

  _createClass(CopyLogger, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      /**
       * copy:
       * see: https://clipboardjs.com/
       */
      this._clipboard = new Clipboard(this._triggerRef.current);

      this._clipboard.on('success', function (e) {
        message.info(_this2.getLocale().copySuccess);
        e.clearSelection();
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._clipboard.destroy();
    }
  }, {
    key: "render",
    value: function render() {
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
      }, React.createElement(Button, {
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
    }
  }]);

  return CopyLogger;
}(React.PureComponent);

CopyLogger.propTypes = {
  rid: PropTypes.string,
  message: PropTypes.string
};
CopyLogger = __decorate([localeContext('CopyLogger', {
  copy: '复制',
  copySuccess: '复制成功'
})], CopyLogger);
export { CopyLogger };