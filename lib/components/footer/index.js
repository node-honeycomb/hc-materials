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

var Footer =
/** @class */
function (_super) {
  __extends(Footer, _super);

  function Footer() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Footer.prototype.render = function () {
    var _a = this.props,
        className = _a.className,
        style = _a.style,
        links = _a.links,
        copyright = _a.copyright;
    return React.createElement("div", {
      className: 'hc-footer ' + className,
      style: style
    }, links && React.createElement("div", {
      className: "hc-footer-links"
    }, links.map(function (link) {
      var linkProps = link.action ? {
        onClick: function onClick(e) {
          return link.action(e, link);
        }
      } : {
        target: link.blankTarget ? '_blank' : '_self',
        href: link.href
      };
      return React.createElement("a", _extends({
        key: link.name || link.title
      }, linkProps), link.title);
    })), copyright && React.createElement("div", {
      className: "hc-footer-copyright"
    }, copyright));
  };

  Footer.propTypes = {
    className: prop_types_1["default"].string,
    style: prop_types_1["default"].object,
    links: prop_types_1["default"].array,
    copyright: prop_types_1["default"].string
  };
  Footer.defaultProps = {
    className: ''
  };
  return Footer;
}(react_1["default"].PureComponent);

exports.Footer = Footer;