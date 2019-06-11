"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sider = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRouterDom = require("react-router-dom");

var _antd = require("antd");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

    _this.toggleClick = function () {
      _this.props.onCollapse(!_this.props.collapsed);

      _this._resizeTimer = setTimeout(function () {
        var event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        window.dispatchEvent(event);
      }, 600);
    };

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

      var iconCom = icon && _react["default"].createElement(_antd.Icon, {
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
          return _react["default"].createElement(_antd.Menu.SubMenu, {
            title: item.icon ? _react["default"].createElement("span", null, item.icon, _react["default"].createElement("span", {
              className: "hc-sider-menu-text"
            }, item.title)) : _react["default"].createElement("span", {
              className: "hc-sider-menu-text"
            }, item.title),
            key: item.name
          }, _this5.getNavMenuItems(item.children, level + 1));
        }

        return _react["default"].createElement(_antd.Menu.Item, {
          key: item.path
        }, HTTP_PATTERN.test(item.path) ? _react["default"].createElement("a", {
          href: item.path,
          target: item.target,
          onClick: function onClick(e) {
            return ['_self', undefined].indexOf(item.target) === -1 && e.stopPropagation();
          }
        }, item.icon, _react["default"].createElement("span", {
          className: "hc-sider-menu-text"
        }, item.title)) : _react["default"].createElement(_reactRouterDom.Link, {
          to: item.path,
          target: item.target
        }, item.icon, _react["default"].createElement("span", {
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
      var Fragment = this.props.affixProps ? _antd.Affix : _react["default"].Fragment;

      var menuOption = _extends({
        mode: 'inline',
        theme: 'dark',
        inlineIndent: 24
      }, this.props.menu);

      var flexDiv;
      var prefix = this.props.prefix;

      if (menuOption.mode === 'horizontal') {
        Conn = _antd.Layout.Header;
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

        Conn = _antd.Layout.Sider; // inspired

        if (sider) {
          connProps = sider;
        } else {
          var width = this.props.width || 256;
          var collapsedWidth = this.props.collapsedWidth || 0;

          if (collapsed) {
            width = collapsedWidth; // collapsedWidth = 0;
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
          flexDiv = _react["default"].createElement("div", {
            className: "hc-sider-collapse-outer"
          }, _react["default"].createElement("div", {
            className: "hc-sider-collapse-inner"
          }, _react["default"].createElement("div", {
            className: "hc-sider-collapse-bg"
          }), _react["default"].createElement("div", {
            className: "hc-sider-collapse-trigger",
            onClick: function onClick() {
              return onCollapse(!collapsed);
            }
          }, collapsed ? _react["default"].createElement(_antd.Icon, {
            type: "menu-unfold"
          }) : _react["default"].createElement(_antd.Icon, {
            type: "menu-fold"
          }))));
        } else {
          prefix = _react["default"].createElement("div", {
            className: "hc-sider-fold"
          }, _react["default"].createElement(_antd.Icon, {
            type: collapsed ? 'menu-unfold' : 'menu-fold',
            onClick: this.toggleClick
          }));
        }
      }

      if (!prefix) {
        prefix = _react["default"].createElement("div", {
          className: "hc-sider-fold"
        });
      }

      return _react["default"].createElement(Conn, connProps, brand ? _react["default"].createElement("div", {
        className: "hc-sider-logo"
      }, _react["default"].createElement(_reactRouterDom.Link, {
        to: brand.path || '/'
      }, _react["default"].createElement("img", {
        src: brand.logo,
        alt: "logo"
      }), _react["default"].createElement("h1", {
        className: "hc-sider-menu-text"
      }, brand.title))) : null, _react["default"].createElement(Fragment, this.props.affixProps, prefix, _react["default"].createElement(_antd.Menu, _extends({
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
}(_react["default"].PureComponent);

exports.Sider = Sider;
Sider.propTypes = {
  routes: _propTypes["default"].array.isRequired,
  route: _propTypes["default"].object,
  orderKeys: _propTypes["default"].array,
  collapsed: _propTypes["default"].bool,
  openLevel: _propTypes["default"].number,
  brand: _propTypes["default"].object,
  getResolver: _propTypes["default"].func,
  subMenus: _propTypes["default"].object,
  getResolvePath: _propTypes["default"].func,
  menu: _propTypes["default"].object,
  prefix: _propTypes["default"].any,
  width: _propTypes["default"].any,
  collapsedWidth: _propTypes["default"].any,
  onCollapse: _propTypes["default"].func,
  flex: _propTypes["default"].bool,
  sider: _propTypes["default"].object,
  header: _propTypes["default"].object,
  affixProps: _propTypes["default"].object
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