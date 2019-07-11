function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import React from 'react';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import { Footer } from '../../components/footer';
import { BasicLayout } from '../basicLayout';
import { Sider } from '../../components/sider';
import { Header } from '../../components/header';
/* eslint-disable react/prop-types */

function Brand(_ref) {
  var logo = _ref.logo,
      title = _ref.title,
      description = _ref.description;
  return React.createElement("div", {
    className: "hc-layout-landing-top"
  }, React.createElement("div", {
    className: "hc-layout-landing-header"
  }, React.createElement(Link, {
    to: "/"
  }, React.createElement("img", {
    alt: "",
    className: "hc-layout-landing-logo",
    src: logo
  }), React.createElement("span", {
    className: "hc-layout-landing-title"
  }, title))), description ? React.createElement("p", {
    className: "hc-layout-landing-desc"
  }, description) : null);
}

export var LandingLayout =
/*#__PURE__*/
function (_BasicLayout) {
  _inherits(LandingLayout, _BasicLayout);

  function LandingLayout() {
    _classCallCheck(this, LandingLayout);

    return _possibleConstructorReturn(this, _getPrototypeOf(LandingLayout).apply(this, arguments));
  }

  _createClass(LandingLayout, [{
    key: "render",
    value: function render() {
      var Footer = this.getComponent('Footer');
      var Brand = this.getComponent('Brand');
      var Header = this.getComponent('Header');
      var style = this.props.style || {
        padding: '110px 0 144px'
      };
      return React.createElement("div", {
        className: 'hc-layout-landing ' + this.props.className,
        style: style
      }, React.createElement(Layout, null, React.createElement(Header, {
        noSider: true,
        Menu: Sider
      }), React.createElement(Layout.Content, null, React.createElement(Brand, null), this.props.viewContent || this.props.children, React.createElement(Footer, {
        className: "hc-layout-landing-footer"
      }))));
    }
  }]);

  return LandingLayout;
}(BasicLayout);
LandingLayout.displayName = 'LandingLayout';
LandingLayout.layoutBlocks = {
  Footer: Footer,
  Brand: Brand,
  Header: Header
};