"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isReactComponent;

function isReactComponent(component) {
  if (typeof component === 'function') {
    return component.prototype.isReactComponent || String(component).includes('return React.createElement');
  } else {
    return component.$$typeof && String(component.$$typeof).indexOf('Symbol(react') === 0;
  }
}