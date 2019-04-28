import React from 'react';

import {Card} from 'antd';
import {Footer} from '../../components/footer';
import {BreadCrumb} from '../../components/breadCrumb';
import {BasicLayout} from '../basicLayout';

export class ContentLayout extends BasicLayout {
  static layoutBlocks = {
    Footer: Footer,
    BreadCrumb
  }

  render() {
    const Footer = this.getComponent('Footer');
    const BreadCrumb = this.getComponent('BreadCrumb');
    return (
      <div className={'hc-layout-content ' + this.props.className} style={this.props.style}>
        <BreadCrumb className="hc-layout-content-breadCrumb" />
        <div className="hc-layout-content-body">
          <Card bordered={false}>
            {this.props.viewContent || this.props.children}
          </Card>
        </div>
        <Footer className="hc-layout-content-footer" />
      </div>
    );
  }
}
