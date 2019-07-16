function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import path from 'path';
import { Link } from 'react-router-dom';
import { Layout, Menu, Icon, Affix } from 'antd';
var HTTP_PATTERN = /^https?:\/\//;

var bubbleSort = function bubbleSort(arr, sortCb) {
  var len = arr.length;

  for (var i = 0; i < len; i++) {
    for (var j = 0; j < len - 1 - i; j++) {
      // 相邻元素两两对比
      if (sortCb(arr[j], arr[j + 1]) > 0) {
        // 元素交换
        var temp = arr[j + 1];
        arr[j + 1] = arr[j];
        arr[j] = temp;
      }
    }
  }

  return arr;
};

export var Sider =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(Sider, _React$PureComponent);

  function Sider(props) {
    var _this;

    _classCallCheck(this, Sider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Sider).call(this, props));

    _this.handleResolve = function (e, params) {
      if (_this.props.getResolver) {
        var resolver = _this.props.getResolver(e, params);

        resolver.then(function (iState) {
          if (_this.mounted) {
            _this.setState(iState);
          }
        });
      }
    };

    _this.handleCollapse = function (collapsed) {
      collapsed = collapsed || !_this.props.collapsed;

      _this.props.onCollapse(collapsed);

      if (_this.props.affixProps) {
        var width = _this.props.width || 256;
        var collapsedWidth = _this.props.collapsedWidth || 0;

        if (collapsed) {
          width = collapsedWidth;
        }
        /* eslint-disable react/no-find-dom-node */


        var dom = ReactDOM.findDOMNode(_this._affixRef.current);
        dom.firstChild.style.width = isNaN(Number(width)) ? width : width + 'px';
      }

      _this._resizeTimer = setTimeout(function () {
        var event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        window.dispatchEvent(event);
      }, 600);
    };

    _this._affixRef = React.createRef();
    var route = props.route;

    var routes = _this.getRoutes(props.routes, props.orderKeys);

    var openKeys;

    if (!props.collapsed) {
      openKeys = route && _this.getParentsResolvePaths(route);

      if (!openKeys || !openKeys.length) {
        openKeys = _this.getOpenKeys(routes, props.subMenus);
      }
    }

    _this.state = {
      routes: routes,
      selectedKeys: route ? [_this.props.getResolvePath(route)] : null,
      openKeys: openKeys,
      subMenus: props.subMenus
    };

    if (props.getResolver) {
      _this._resolver = props.getResolver();
    }

    return _this;
  }

  _createClass(Sider, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.mounted = true;
      this._resolver && this._resolver.then(function (iState) {
        if (_this2.mounted) {
          _this2.setState(iState);
        }
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mounted = false;
      clearTimeout(this._resizeTimer);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevProps.route !== this.props.route || prevState.routes !== this.state.routes) {
        var resolvePath = this.props.getResolvePath(this.props.route);

        if (!this.state.selectedKeys || this.state.selectedKeys.indexOf(resolvePath) === -1) {
          var routes = this.getRoutes(this.state.routes || this.props.routes, this.props.orderKeys);
          var openKeys;

          if (!this.props.collapsed) {
            openKeys = this.props.route && this.getParentsResolvePaths(this.props.route);

            if (!openKeys || !openKeys.length) {
              openKeys = this.getOpenKeys(routes, this.props.subMenus);
            }
          }

          this.setState({
            routes: routes,
            selectedKeys: [resolvePath],
            openKeys: openKeys
          });
        }
      }
    }
  }, {
    key: "getRoutes",
    value: function getRoutes(routes, orderKeys) {
      if (orderKeys) {
        var map = {};
        orderKeys.forEach(function (v, index) {
          return map[v] = index;
        });
        return bubbleSort(routes, function (a, b) {
          var aName = a.children ? a.name : a.navKey || a.name;
          var bName = b.children ? b.name : b.navKey || b.name;
          var compare = map[aName] - map[bName];

          if (compare === 0 || isNaN(compare)) {
            return a.value - b.value;
          } else {
            return compare;
          }
        });
      } else {
        return routes;
      }
    }
  }, {
    key: "getOpenKeys",
    value: function getOpenKeys(routes, subMenus) {
      var _this3 = this;

      var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      if (this.props.openLevel) {
        var cacheMap = {};
        var keys = [];
        routes.forEach(function (route) {
          var children = route.children || route.routes;

          if (route.navKey && subMenus[route.navKey]) {
            if (!cacheMap[route.navKey]) {
              cacheMap[route.navKey] = true;
              keys.push(route.navKey);
            }
          } else if (children && level < _this3.props.openLevel) {
            if (!cacheMap[route.name]) {
              cacheMap[route.name] = true;
              keys.push(route.name);
            }

            keys = keys.concat(_this3.getOpenKeys(children, subMenus, level + 1));
          }
        });
        return keys;
      } else {
        return null;
      }
    }
  }, {
    key: "getParentsResolvePaths",
    value: function getParentsResolvePaths(route) {
      var resolvePaths = [];
      var navKey = route.navKey;

      while (route.parent) {
        route = route.parent;
        resolvePaths.push(route.name);
      }

      if (navKey && this.props.subMenus[navKey]) {
        resolvePaths.push(navKey);
      }

      return resolvePaths;
    }
  }, {
    key: "packNode",
    value: function packNode(item, level) {
      var _this4 = this;

      var subMenus = this.state.subMenus;

      if (item.hide || item.disabled) {
        return null;
      }

      if (item.navKey && subMenus[item.navKey]) {
        if (subMenus[item.navKey].hide || subMenus[item.navKey].disabled) {
          return null;
        }

        if (level < 1) {
          subMenus[item.navKey].children = subMenus[item.navKey].children || [];
          var idx = subMenus[item.navKey].children.findIndex(function (d) {
            return d.name === item.name;
          });

          if (idx === 0) {
            item = subMenus[item.navKey];
          } else if (idx === -1) {
            subMenus[item.navKey].children = subMenus[item.navKey].children || [];
            idx = subMenus[item.navKey].children.push(item);

            if (idx > 1) {
              clearTimeout(this._timer);
              this._timer = setTimeout(function () {
                clearTimeout(_this4._timer);

                if (_this4.mounted) {
                  _this4.forceUpdate();
                }
              });
              return null;
            } else {
              var navKey = item.navKey;
              item = subMenus[item.navKey];
              item.name = navKey;
            }
          } else {
            return null;
          }
        }
      } // #! 从路由配置项中获取routes


      var target = item.target;
      var title = item.title || item.name;
      var icon = item.icon;
      var iconCom = icon && React.createElement(Icon, {
        type: icon
      });
      var children = item.children || item.routes || [];

      if (title) {
        return {
          target: target,
          icon: iconCom,
          title: title,
          name: item.navKey ? item.navKey + '-' + item.name : item.name,
          children: children,
          hide: item.hide || item.disabled,
          path: children.length ? null : this.props.getResolvePath(item)
        };
      } else {
        return null;
      }
    }
  }, {
    key: "getNavMenuItems",
    value: function getNavMenuItems(menusData) {
      var _this5 = this;

      var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (!menusData) {
        return [];
      }

      return menusData.map(function (item) {
        item = _this5.packNode(item, level);

        if (!item) {
          return null;
        }

        if (item.children.length) {
          return React.createElement(Menu.SubMenu, {
            title: item.icon ? React.createElement("span", null, item.icon, React.createElement("span", {
              className: "hc-sider-menu-text"
            }, item.title)) : React.createElement("span", {
              className: "hc-sider-menu-text"
            }, item.title),
            key: item.name
          }, _this5.getNavMenuItems(item.children, level + 1));
        }

        return React.createElement(Menu.Item, {
          key: item.path
        }, HTTP_PATTERN.test(item.path) ? React.createElement("a", {
          href: item.path,
          target: item.target,
          onClick: function onClick(e) {
            return ['_self', undefined].indexOf(item.target) === -1 && e.stopPropagation();
          }
        }, item.icon, React.createElement("span", {
          className: "hc-sider-menu-text"
        }, item.title)) : React.createElement(Link, {
          to: item.path,
          target: item.target
        }, item.icon, React.createElement("span", {
          className: "hc-sider-menu-text"
        }, item.title)));
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      var Conn;
      var connProps;
      var sider = this.props.sider;
      var header = this.props.header;
      var brand = this.props.brand;
      var _this$props = this.props,
          collapsed = _this$props.collapsed,
          onCollapse = _this$props.onCollapse,
          flex = _this$props.flex;
      var Fragment = this.props.affixProps ? Affix : React.Fragment;

      var menuOption = _extends({
        mode: 'inline',
        theme: 'dark',
        inlineIndent: 12
      }, this.props.menu);

      var flexDiv;
      var prefix = this.props.prefix;

      if (menuOption.mode === 'horizontal') {
        Conn = Layout.Header;
        connProps = header || {};
        delete menuOption.inlineCollapsed;
      } else {
        menuOption.style = menuOption.style || {
          width: '100%'
        };

        if (!collapsed) {
          menuOption.inlineCollapsed = true;
          menuOption.openKeys = this.state.openKeys;
        }

        Conn = Layout.Sider; // inspired

        if (sider) {
          connProps = sider;
        } else {
          var width = this.props.width || 256;
          var collapsedWidth = this.props.collapsedWidth || 0;

          if (collapsed) {
            width = collapsedWidth;
          }

          connProps = {
            trigger: null,
            collapsible: true,
            breakpoint: 'md',
            width: width,
            collapsed: collapsed,
            collapsedWidth: collapsedWidth
          };
        }

        connProps.className = 'hc-sider ' + 'hc-sider-' + menuOption.theme + ' ' + (collapsed ? 'hc-sider-collapse' : 'hc-sider-expand');

        if (connProps.flex || flex) {
          flexDiv = React.createElement("div", {
            className: "hc-sider-collapse-outer"
          }, React.createElement("div", {
            className: "hc-sider-collapse-inner"
          }, React.createElement("div", {
            className: "hc-sider-collapse-bg"
          }), React.createElement("div", {
            className: "hc-sider-collapse-trigger",
            onClick: function onClick() {
              return onCollapse(!collapsed);
            }
          }, collapsed ? React.createElement(Icon, {
            type: "menu-unfold"
          }) : React.createElement(Icon, {
            type: "menu-fold"
          }))));
        } else {
          prefix = React.createElement("div", {
            className: "hc-sider-fold"
          }, React.createElement(Icon, {
            type: collapsed ? 'menu-unfold' : 'menu-fold',
            onClick: function onClick() {
              return _this6.handleCollapse();
            }
          }));
        }
      }

      if (!prefix) {
        prefix = React.createElement("div", {
          className: "hc-sider-fold"
        });
      }

      return React.createElement(Conn, connProps, brand ? React.createElement("div", {
        className: "hc-sider-logo"
      }, React.createElement(Link, {
        to: brand.path || '/'
      }, React.createElement("img", {
        src: brand.logo,
        alt: "logo"
      }), React.createElement("h1", {
        className: "hc-sider-menu-text"
      }, brand.title))) : null, React.createElement(Fragment, _extends({}, this.props.affixProps, {
        ref: this._affixRef
      }), prefix, React.createElement(Menu, _extends({
        onOpenChange: function onOpenChange(openKeys) {
          return !collapsed && _this6.setState({
            openKeys: openKeys
          });
        },
        onSelect: function onSelect(item) {
          return _this6.setState({
            selectedKeys: item.selectedKeys
          });
        },
        selectedKeys: this.state.selectedKeys
      }, menuOption), this.getNavMenuItems(this.state.routes)), flexDiv));
    }
  }]);

  return Sider;
}(React.PureComponent);
Sider.propTypes = {
  routes: PropTypes.array.isRequired,
  route: PropTypes.object,
  orderKeys: PropTypes.array,
  collapsed: PropTypes.bool,
  openLevel: PropTypes.number,
  brand: PropTypes.object,
  getResolver: PropTypes.func,
  subMenus: PropTypes.object,
  getResolvePath: PropTypes.func,
  menu: PropTypes.object,
  prefix: PropTypes.any,
  width: PropTypes.any,
  collapsedWidth: PropTypes.any,
  onCollapse: PropTypes.func,
  flex: PropTypes.bool,
  sider: PropTypes.object,
  header: PropTypes.object,
  affixProps: PropTypes.object
};
Sider.defaultProps = {
  subMenus: {},
  getResolvePath: function getResolvePath(item) {
    return path.normalize('/' + item.path);
  },
  brand: {
    logo: '//img.alicdn.com/tfs/TB14dINRpXXXXcyXXXXXXXXXXXX-64-64.png?t=1517996107967',
    title: 'App'
  }
};