"use strict";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var prop_types_1 = require("prop-types");

function localeContext(name, defaultLocale) {
  return function (BaseComponent) {
    BaseComponent.contextTypes = _extends(BaseComponent.contextTypes || {}, {
      hcLocale: prop_types_1["default"].object
    });

    BaseComponent.prototype.getLocale = function (key) {
      var locale;

      if (this.context.hcLocale) {
        locale = this._locale;
      } else {
        locale = this._locale = _extends(this.context.hcLocale && this.context.hcLocale[name] || {}, defaultLocale, this.props && this.props.locale);
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

exports.localeContext = localeContext;