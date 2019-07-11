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
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { NavLink } from '../navLink';
export var BreadCrumb =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(BreadCrumb, _React$PureComponent);

  function BreadCrumb() {
    _classCallCheck(this, BreadCrumb);

    return _possibleConstructorReturn(this, _getPrototypeOf(BreadCrumb).apply(this, arguments));
  }

  _createClass(BreadCrumb, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          style = _this$props.style,
          navs = _this$props.navs,
          links = _this$props.links,
          extra = _this$props.extra;
      return React.createElement("div", {
        className: 'hc-breadCrumb ' + className,
        style: style
      }, React.createElement(Breadcrumb, null, navs.map(function (item, index) {
        if (item.link) {
          return React.createElement(Breadcrumb.Item, {
            key: index
          }, React.createElement(Link, {
            to: item.link
          }, item.text));
        } else {
          return React.createElement(Breadcrumb.Item, {
            key: index
          }, item.text);
        }
      }), links || extra ? React.createElement(Breadcrumb.Item, {
        className: "hc-breadCrumb-extra"
      }, links && React.createElement(NavLink, {
        links: links
      }), extra) : null), this.props.combox);
    }
  }]);

  return BreadCrumb;
}(React.PureComponent);

BreadCrumb.parse = function (route, subRoutes) {
  var navs = [];

  if (route) {
    navs.push({
      text: route.title
    });

    if (route.navKey && subRoutes[route.navKey]) {
      navs.unshift({
        text: subRoutes[route.navKey].title || route.navKey
      });
    }

    while ((route = route.parent) && route.title) {
      navs.unshift({
        link: route.resolvePath,
        text: route.title
      });
    }
  }

  return navs;
};

BreadCrumb.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  combox: PropTypes.element,
  navs: PropTypes.array,
  links: PropTypes.array,
  extra: PropTypes.any
};
BreadCrumb.defaultProps = {
  className: '',
  navs: []
};