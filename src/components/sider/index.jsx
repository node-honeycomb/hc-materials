import React from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import {Layout, Menu, Icon} from 'antd';

const HTTP_PATTERN = /^https?:\/\//;

const bubbleSort = (arr, sortCb) => {
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

export class Sider extends React.PureComponent {
  static propTypes = {
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
    header: PropTypes.object
  }

  static defaultProps = {
    subMenus: {},
    getResolvePath: (item) => item.resolvePath || item.path,
    brand: {
      logo: '//img.alicdn.com/tfs/TB14dINRpXXXXcyXXXXXXXXXXXX-64-64.png?t=1517996107967',
      title: 'App'
    }
  }

  constructor(props) {
    super(props);

    const route = props.route;
    const routes = this.getRoutes(props.routes, props.orderKeys);
    let openKeys = route && this.getParentsResolvePaths(route);
    if (!openKeys || !openKeys.length) {
      openKeys = this.getOpenKeys(routes, props.subMenus);
    }
    this.state = {
      routes: routes,
      selectedKeys: route ? [this.props.getResolvePath(route)] : null,
      openKeys: openKeys,
      subMenus: props.subMenus
    };
    if (props.getResolver) {
      this._resolver = props.getResolver();
    }
  }

  handleResolve = (e, params) => {
    if (this.props.getResolver) {
      const resolver = this.props.getResolver(e, params);
      resolver.then(iState => {
        if (this.mounted) {
          this.setState(iState);
        }
      });
    }
  }

  componentDidMount() {
    this.mounted = true;
    this._resolver && this._resolver.then(iState => {
      if (this.mounted) {
        this.setState(iState);
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this._resizeTimer);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.route !== this.props.route || prevState.routes !== this.state.routes) {
      const resolvePath = this.props.getResolvePath(this.props.route);
      if (!this.state.selectedKeys || this.state.selectedKeys.indexOf(resolvePath) === -1) {
        const routes = this.getRoutes(this.state.routes || this.props.routes, this.props.orderKeys);
        let openKeys = this.props.route && this.getParentsResolvePaths(this.props.route);
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
  }

  getRoutes(routes, orderKeys) {
    if (orderKeys) {
      const map = {};
      orderKeys.forEach((v, index) => map[v] = index);
      return bubbleSort(routes, (a, b) => {
        const aName = a.children ? a.name : a.navKey || a.name;
        const bName = b.children ? b.name : b.navKey || b.name;
        const compare = map[aName] - map[bName];
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

  getOpenKeys(routes, subMenus, level = 0) {
    if (this.props.openLevel) {
      const cacheMap = {};
      let keys = [];
      routes.forEach(route => {
        const children = route.children || route.routes;
        if (route.navKey && subMenus[route.navKey]) {
          if (!cacheMap[route.navKey]) {
            cacheMap[route.navKey] = true;
            keys.push(route.navKey);
          }
        } else if (children && level < this.props.openLevel) {
          if (!cacheMap[route.name]) {
            cacheMap[route.name] = true;
            keys.push(route.name);
          }
          keys = keys.concat(this.getOpenKeys(children, subMenus, level + 1));
        }
      });
      return keys;
    } else {
      return null;
    }
  }

  getParentsResolvePaths(route) {
    const resolvePaths = [];
    const navKey = route.navKey;
    while (route.parent) {
      route = route.parent;
      resolvePaths.push(route.name);
    }
    if (navKey && this.props.subMenus[navKey]) {
      resolvePaths.push(navKey);
    }
    return resolvePaths;
  }

  packNode(item, level) {
    const subMenus = this.state.subMenus;
    if (item.hide || item.disabled) {
      return null;
    }
    if (item.navKey && subMenus[item.navKey]) {
      if (subMenus[item.navKey].hide || subMenus[item.navKey].disabled) {
        return null;
      }
      if (level < 1) {
        subMenus[item.navKey].children = subMenus[item.navKey].children || [];
        let idx = subMenus[item.navKey]
          .children
          .findIndex(d => d.name === item.name);
        if (idx === 0) {
          item = subMenus[item.navKey];
        } else if (idx === -1) {
          subMenus[item.navKey].children = subMenus[item.navKey].children || [];
          idx = subMenus[item.navKey]
            .children
            .push(item);
          if (idx > 1) {
            clearTimeout(this._timer);
            this._timer = setTimeout(() => {
              clearTimeout(this._timer);
              if (this.mounted) {
                this.forceUpdate();
              }
            });
            return null;
          } else {
            const navKey = item.navKey;
            item = subMenus[item.navKey];
            item.name = navKey;
          }
        } else {
          return null;
        }
      }
    }

    // #! 从路由配置项中获取routes
    const target = item.target;
    const title = item.title || item.name;
    const icon = item.icon;
    const iconCom = icon && (<Icon type={icon} />);
    const children = item.children || item.routes || [];

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

  getNavMenuItems(menusData, level = 0) {
    if (!menusData) {
      return [];
    }
    return menusData.map((item) => {
      item = this.packNode(item, level);

      if (!item) {
        return null;
      }

      if (item.children.length) {
        return (
          <Menu.SubMenu
            title={item.icon ?
              (
                <span>
                  {item.icon}
                  <span className="hc-sider-menu-text">{item.title}</span>
                </span>
              ) : (
                <span className="hc-sider-menu-text">{item.title}</span>
              )}
            key={item.name}>
            {this.getNavMenuItems(item.children, level + 1)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item key={item.path}>
          {HTTP_PATTERN.test(item.path) ?
            (
              <a
                href={item.path}
                target={item.target}
                onClick={e => ['_self', undefined].indexOf(item.target) === -1 && e.stopPropagation()}>
                {item.icon}<span className="hc-sider-menu-text">{item.title}</span>
              </a>
            ) :
            (
              <Link to={item.path} target={item.target}>
                {item.icon}<span className="hc-sider-menu-text">{item.title}</span>
              </Link>
            )}
        </Menu.Item>
      );
    });
  }

  toggleClick = () => {
    this
      .props
      .onCollapse(!this.props.collapsed);

    this._resizeTimer = setTimeout(() => {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('resize', true, false);
      window.dispatchEvent(event);
    }, 600);
  }


  render() {
    let Conn;
    let connProps;
    let sider = this.props.sider;
    let header = this.props.header;
    const brand = this.props.brand;

    const menuOption = Object.assign({
      mode: 'inline',
      theme: 'dark',
      inlineIndent: 24
    }, this.props.menu);
    let flexDiv;
    let prefix = this.props.prefix;
    if (menuOption.mode === 'horizontal') {
      Conn = Layout.Header;
      connProps = header || {};
    } else {
      menuOption.style = menuOption.style || {
        width: '100%'
      };
      menuOption.openKeys = this.state.collapsed ? null : this.state.openKeys;
      const {collapsed, onCollapse, flex} = this.props;
      Conn = Layout.Sider;
      // inspired
      if (sider) {
        connProps = sider;
      } else {
        let width = this.props.width || 256;
        let collapsedWidth = this.props.collapsedWidth || 0;
        if (collapsed) {
          width = collapsedWidth;
          // collapsedWidth = 0;
        }
        connProps = {
          trigger: null,
          collapsible: true,
          breakpoint: 'md',
          width: width,
          collapsedWidth: collapsedWidth
        };
      }
      connProps.className = 'hc-sider ' + 'hc-sider-' + menuOption.theme + ' ' + (collapsed ? 'hc-sider-collapse' : 'hc-sider-expand');

      if (connProps.flex || flex) {
        flexDiv = (<div className="hc-sider-collapse-outer">
          <div className="hc-sider-collapse-inner">
            <div className="hc-sider-collapse-bg"></div>
            <div className="hc-sider-collapse" onClick={() => onCollapse(!collapsed)}>
              {collapsed ? (<Icon type="menu-unfold" />) : <Icon type="menu-fold" />}
            </div>
          </div>
        </div>);
      } else {
        prefix = (<div className="hc-sider-fold"><Icon
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggleClick} /></div>);
      }
    }
    if (!prefix) {
      prefix = (<div className="hc-sider-fold"></div>);
    }
    return (
      <Conn {...connProps}>
        {brand ? (<div className='hc-sider-logo'>
          <Link to={brand.path || '/'}>
            <img src={brand.logo} alt="logo" />
            <h1 className="hc-sider-menu-text">{brand.title}</h1>
          </Link>
        </div>) :  null}
        {prefix}
        <Menu
          onOpenChange={(openKeys) => this.setState({openKeys: openKeys})}
          onSelect={(item) => this.setState({selectedKeys: item.selectedKeys})}
          selectedKeys={this.state.selectedKeys}
          inlineCollapsed={this.state.collapsed}
          {...menuOption}>
          {this.getNavMenuItems(this.state.routes)}
        </Menu>
        {flexDiv}
      </Conn>
    );
  }
}
