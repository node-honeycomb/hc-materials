"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.localeContext = localeContext;

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function localeContext(name, defaultLocale) {
  return function (BaseComponent) {
    BaseComponent.contextTypes = _extends(BaseComponent.contextTypes || {}, {
      hcLocale: _propTypes["default"].object,
      antLocale: _propTypes["default"].object
    });

    BaseComponent.prototype.getLocale = function (key) {
      var locale;

      if (this._locale) {
        locale = this._locale;
      } else {
        var hcLocale = this.context.hcLocale || this.context.antLocale || {};
        locale = this._locale = _extends(defaultLocale, hcLocale[name], this.props && this.props.locale);
      }

      if (key) {
        return locale[key];
      } else {
        return locale;
      }
    };

    return BaseComponent;
  };
}