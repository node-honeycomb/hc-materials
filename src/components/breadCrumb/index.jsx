import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Breadcrumb from 'antd/lib/breadcrumb';

import {NavLink} from '../navLink';

export class BreadCrumb extends React.PureComponent {
  static parse = function (route, subRoutes) {
    const navs = [];
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
        navs.unshift({link: route.resolvePath, text: route.title});
      }
    }
    return navs;
  }
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,

    combox: PropTypes.element,
    navs: PropTypes.array,
    links: PropTypes.array,
    extra: PropTypes.any
  }

  static defaultProps = {
    className: '',
    navs: []
  }

  render() {
    const {className, style, navs, links, extra} = this.props;

    return (
      <div className={'hc-breadcrumb ' + className} style={style}>
        <Breadcrumb>
          {navs
            .map((item, index) => {
              if (item.link) {
                return (
                  <Breadcrumb.Item key={index}>
                    <Link to={item.link}>{item.text}</Link>
                  </Breadcrumb.Item>
                );
              } else {
                return (
                  <Breadcrumb.Item key={index}>
                    {item.text}
                  </Breadcrumb.Item>
                );
              }
            })}
          {links || extra ? (<Breadcrumb.Item className="hc-breadcrumb-extra">
            {links && <NavLink links={links} />}
            {extra}
          </Breadcrumb.Item>) : null}
        </Breadcrumb>
        {this.props.combox}
      </div>
    );
  }
}

