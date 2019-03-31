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

var react_router_dom_1 = require("react-router-dom");

var layout_1 = require("antd/lib/layout");

var menu_1 = require("antd/lib/menu");

var icon_1 = require("antd/lib/icon");

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

var Sider =
/** @class */
function (_super) {
  __extends(Sider, _super);

  function Sider(props) {
    var _this = _super.call(this, props) || this;

    var route = props.route;

    var routes = _this.getRoutes(props.routes, props.orderKeys);

    var openKeys = route && _this.getParentsResolvePaths(route);

    if (!openKeys || !openKeys.length) {
      openKeys = _this.getOpenKeys(routes, props.subMenus);
    }

    _this.state = {
      routes: routes,
      selectedKeys: route ? [_this.props.getResolvePath(route)] : null,
      openKeys: openKeys,
      subMenus: props.subMenus
    };
    return _this;
  }

  Sider.prototype.componentDidMount = function () {
    this.mounted = true;
  };

  Sider.prototype.componentWillUnmount = function () {
    this.mounted = false;
  };

  Sider.prototype.componentDidUpdate = function (prevProps) {
    if (prevProps.route !== this.props.route) {
      var resolvePath = this.props.getResolvePath(this.props.route);

      if (!this.state.selectedKeys || this.state.selectedKeys.indexOf(resolvePath) === -1) {
        var routes = this.getRoutes(this.props.routes, this.props.orderKeys);
        var openKeys = this.state.openKeys.length ? this.state.openKeys : this.props.route && this.getParentsResolvePaths(this.props.route);

        if (!openKeys || !openKeys.length) {
          openKeys = this.getOpenKeys(routes, this.props.subMenus);
        }

        this.setState({
          routes: routes,
          selectedKeys: [resolvePath],
          openKeys: openKeys
        });
      }
    }
  };

  Sider.prototype.getRoutes = function (routes, orderKeys) {
    if (orderKeys) {
      var map_1 = {};
      orderKeys.forEach(function (v, index) {
        return map_1[v] = index;
      });
      return bubbleSort(routes, function (a, b) {
        var aName = a.children ? a.name : a.navKey || a.name;
        var bName = b.children ? b.name : b.navKey || b.name;
        var compare = map_1[aName] - map_1[bName];

        if (compare === 0 || isNaN(compare)) {
          return a.value - b.value;
        } else {
          return compare;
        }
      });
    } else {
      return routes;
    }
  };

  Sider.prototype.getOpenKeys = function (routes, subMenus, level) {
    var _this = this;

    if (level === void 0) {
      level = 0;
    }

    if (this.props.openLevel) {
      var cacheMap_1 = {};
      var keys_1 = [];
      routes.forEach(function (route) {
        var children = route.children || route.childRoutes;

        if (route.navKey && subMenus[route.navKey]) {
          if (!cacheMap_1[route.navKey]) {
            cacheMap_1[route.navKey] = true;
            keys_1.push(route.navKey);
          }
        } else if (children && level < _this.props.openLevel) {
          if (!cacheMap_1[route.name]) {
            cacheMap_1[route.name] = true;
            keys_1.push(route.name);
          }

          keys_1 = keys_1.concat(_this.getOpenKeys(children, subMenus, level + 1));
        }
      });
      return keys_1;
    } else {
      return null;
    }
  };

  Sider.prototype.getParentsResolvePaths = function (route) {
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
  };

  Sider.prototype.packNode = function (item, level) {
    var _this = this;

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
              clearTimeout(_this._timer);

              if (_this.mounted) {
                _this.forceUpdate();
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
    } // #! 从路由配置项中获取childRoutes


    var target = item.target;
    var title = item.title || item.name;
    var icon = item.icon;
    var iconCom = icon && React.createElement(icon_1["default"], {
      type: icon
    });
    var children = item.children || item.childRoutes || [];

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
  };

  Sider.prototype.getNavMenuItems = function (menusData, level) {
    var _this = this;

    if (level === void 0) {
      level = 0;
    }

    if (!menusData) {
      return [];
    }

    return menusData.map(function (item) {
      item = _this.packNode(item, level);

      if (!item) {
        return null;
      }

      if (item.children.length) {
        return React.createElement(menu_1["default"].SubMenu, {
          title: item.icon ? React.createElement("span", null, item.icon, React.createElement("span", {
            className: "hc-sider-menu-text"
          }, item.title)) : React.createElement("span", {
            className: "hc-sider-menu-text"
          }, item.title),
          key: item.name
        }, _this.getNavMenuItems(item.children, level + 1));
      }

      return React.createElement(menu_1["default"].Item, {
        key: item.path
      }, HTTP_PATTERN.test(item.path) ? React.createElement("a", {
        href: item.path,
        target: item.target,
        onClick: function onClick(e) {
          return ['_self', undefined].indexOf(item.target) === -1 && e.stopPropagation();
        }
      }, item.icon, React.createElement("span", {
        className: "hc-sider-menu-text"
      }, item.title)) : React.createElement(react_router_dom_1.Link, {
        to: item.path,
        target: item.target
      }, item.icon, React.createElement("span", {
        className: "hc-sider-menu-text"
      }, item.title)));
    });
  };

  Sider.prototype.render = function () {
    var _this = this;

    var Conn;
    var connProps;
    var sider = this.props.sider;
    var header = this.props.header;
    var brand = this.props.brand;
    var flexDiv;

    var menuOption = _extends({
      mode: 'inline',
      theme: 'dark',
      inlineIndent: 24
    }, this.props.menu);

    if (menuOption.mode === 'horizontal') {
      Conn = layout_1["default"].Header;
      connProps = header || {};
    } else {
      menuOption.style = menuOption.style || {
        margin: '16px 0',
        width: '100%'
      };
      menuOption.openKeys = this.state.collapsed ? null : this.state.openKeys;
      var _a = this.props,
          collapsed_1 = _a.collapsed,
          onCollapse_1 = _a.onCollapse,
          flex = _a.flex;
      Conn = layout_1["default"].Sider; // inspired

      if (sider) {
        connProps = sider;
      } else {
        var width = this.props.width || 256;
        var collapsedWidth = this.props.collapsedWidth || 80;

        if (collapsed_1) {
          width = 0;
          collapsedWidth = 0;
        }

        connProps = {
          trigger: null,
          collapsible: true,
          breakpoint: 'md',
          width: width,
          collapsedWidth: collapsedWidth
        };
      }

      connProps.className = 'hc-sider ' + 'hc-sider-' + menuOption.theme + ' ' + (collapsed_1 ? 'hc-sider-collapse' : 'hc-sider-expand');

      if (connProps.flex || flex) {
        flexDiv = React.createElement("div", {
          className: "hc-sider-collapse-outer"
        }, React.createElement("div", {
          className: "hc-sider-collapse-inner"
        }, React.createElement("div", {
          className: "hc-sider-collapse-bg"
        }), React.createElement("div", {
          className: "hc-sider-collapse",
          onClick: function onClick() {
            return onCollapse_1(!collapsed_1);
          }
        }, collapsed_1 ? React.createElement(icon_1["default"], {
          type: "menu-unfold"
        }) : React.createElement(icon_1["default"], {
          type: "menu-fold"
        }))));
      }
    }

    return React.createElement(Conn, connProps, brand ? React.createElement("div", {
      className: "hc-sider-logo"
    }, React.createElement(react_router_dom_1.Link, {
      to: brand.path || '/'
    }, React.createElement("img", {
      src: brand.logo,
      alt: "logo"
    }), React.createElement("h1", {
      className: "hc-sider-menu-text"
    }, brand.title))) : null, React.createElement(menu_1["default"], _extends({
      onOpenChange: function onOpenChange(openKeys) {
        return _this.setState({
          openKeys: openKeys
        });
      },
      onSelect: function onSelect(item) {
        return _this.setState({
          selectedKeys: item.selectedKeys
        });
      },
      selectedKeys: this.state.selectedKeys,
      inlineCollapsed: this.state.collapsed
    }, menuOption), this.getNavMenuItems(this.state.routes)), flexDiv);
  };

  Sider.propTypes = {
    routes: prop_types_1["default"].array.isRequired,
    route: prop_types_1["default"].object,
    orderKeys: prop_types_1["default"].array,
    collapsed: prop_types_1["default"].bool,
    openLevel: prop_types_1["default"].number,
    brand: prop_types_1["default"].object,
    subMenus: prop_types_1["default"].object,
    getResolvePath: prop_types_1["default"].func,
    menu: prop_types_1["default"].object,
    width: prop_types_1["default"].any,
    collapsedWidth: prop_types_1["default"].any,
    onCollapse: prop_types_1["default"].func,
    flex: prop_types_1["default"].bool,
    sider: prop_types_1["default"].object,
    header: prop_types_1["default"].object
  };
  Sider.defaultProps = {
    subMenus: {},
    getResolvePath: function getResolvePath(item) {
      return item.resolvePath || item.path;
    },
    brand: {
      logo: '//img.alicdn.com/tfs/TB14dINRpXXXXcyXXXXXXXXXXXX-64-64.png?t=1517996107967',
      title: 'App'
    }
  };
  return Sider;
}(react_1["default"].PureComponent);

exports.Sider = Sider;