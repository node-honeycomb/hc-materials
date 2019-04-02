import React from 'react';
import PropTypes from 'prop-types';
import Layout from 'antd/lib/layout';

import {Sider} from '../../components/sider';
import {Header} from '../../components/header';
import {localStorage} from '../../core/localStorage';
import {BasicLayout} from '../basicLayout';

const COLLAPSED_KEY = 'beatle_console_sidebar';

export class ConsoleLayout extends BasicLayout {
  static layoutBlocks = {
    Header,
    Sider
  };

  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object
  }

  static defaultProps = {
    className: ''
  }

  constructor(props) {
    super(props);
    this.state = {
      inited: true,
      collapsed: localStorage.get(COLLAPSED_KEY) === 'true' || false
    };
  }

  render() {
    const collapseCfg = {
      collapsed: this.state.collapsed,
      onCollapse: collapsed => {
        // if (this.state.inited && this.state.collapsed) {
        //   this.setState({inited: false});
        //   return;
        // }
        this.setState({collapsed: collapsed, inited: false});
        localStorage.set(COLLAPSED_KEY, collapsed);
      }
    };
    const Sider = this.getComponent('Sider');
    const Header = this.getComponent('Header');

    return (
      <div className={'hc-layout-console ' + this.props.className} style={this.props.style}>
        <Layout className="hc-layout-console_has-sider">
          <Sider {...collapseCfg} />
          <Layout>
            <Header {...collapseCfg} />
            <Layout.Content className="hc-layout-console-body">
              {this.props.viewContent || this.props.children}
            </Layout.Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}
