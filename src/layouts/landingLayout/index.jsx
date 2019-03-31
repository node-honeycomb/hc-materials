import React from 'react';
import Layout from 'antd/lib/layout';
import {Link} from 'react-router-dom';
import {Footer} from '../../components/footer';
import {BasicLayout} from '../basicLayout';
import {Sider} from '../../components/sider';
import {Header} from '../../components/header';

/* eslint-disable react/prop-types */
function Brand({logo, title, description}) {
  return (
    <div className="hc-layout-landing-top">
      <div className="hc-layout-landing-header">
        <Link to="/">
          <img alt="" className="hc-layout-landing-logo" src={logo} />
          <span className="hc-layout-landing-title">{title}</span>
        </Link>
      </div>
      {description ? (<p className="hc-layout-landing-desc">{description}</p>) : null}
    </div>
  );
}

export class LandingLayout extends BasicLayout {
  static displayName = 'LandingLayout';

  static layoutBlocks = {
    Footer: Footer,
    Brand,
    Header
  }

  render() {
    const Footer = this.getComponent('Footer');
    const Brand = this.getComponent('Brand');
    const Header = this.getComponent('Header');
    const style = this.props.style || {padding: '110px 0 144px'};
    return (
      <div className={'hc-layout-landing ' + this.props.className} style={style}>
        <Layout>
          <Header noSider={true} Menu={Sider} />
          <Layout.Content>
            <Brand />
            {this.props.viewContent || this.props.children}
            <Footer className="hc-layout-landing-footer" />
          </Layout.Content>
        </Layout>
      </div>
    );
  }
}
