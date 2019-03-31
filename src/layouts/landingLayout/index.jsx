import React from 'react';
import Layout from 'antd/lib/layout';
import {Link} from 'react-router-dom';
import {GlobalFooter} from '../../components/globalFooter';
import {BasicLayout} from '../basicLayout';
import {Sider} from '../../components/sider';
import {Header} from '../../components/header';

/* eslint-disable react/prop-types */
function Brand({logo, title, description, Link}) {
  return (
    <div className="j-top">
      <div className="j-header">
        <Link to="/">
          <img alt="" className="j-logo" src={logo} />
          <span className="j-title">{title}</span>
        </Link>
      </div>
      {description ? (<p className="j-desc">{description}</p>) : null}
    </div>
  );
}

export class LandingLayout extends BasicLayout {
  static displayName = 'LandingLayout';

  static layoutBlocks = {
    Footer: GlobalFooter,
    Link,
    Brand,
    Header
  }

  render() {
    const Footer = this.getComponent('Footer');
    const BLink = this.getComponent('Link');
    const Brand = this.getComponent('Brand');
    const Header = this.getComponent('Header');
    const style = this.props.style || {padding: '110px 0 144px'};
    return (
      <div className={'j-layout-landing ' + this.props.className} style={style}>
        <Layout>
          <Header noSider={true} Menu={Sider} />
          <Layout.Content>
            <Brand Link={BLink} />
            {this.props.viewContent || this.props.children}
            <Footer className="j-footer" />
          </Layout.Content>
        </Layout>
      </div>
    );
  }
}
