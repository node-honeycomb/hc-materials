import React from 'react';
import PropTypes from 'prop-types';

import Layout from 'antd/lib/layout';
import Icon from 'antd/lib/icon';
import Dropdown from 'antd/lib/dropdown';
import Spin from 'antd/lib/spin';
import Menu from 'antd/lib/menu';
import Avatar from 'antd/lib/avatar';

import {Search} from '../search';
import {Sider} from '../sider';

import {localeContext} from '../../core/localeContext';

@localeContext('Header', {
  searchPlaceholder: '输入关键字进行搜索',
  profile: '个人信息',
  setting: '设置',
  logout: '登出'
})
export class Header extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    collapsed: PropTypes.bool,
    onCollapse: PropTypes.func,
    noSider: PropTypes.bool,
    project: PropTypes.any,
    theme: PropTypes.string,
    onChange: PropTypes.func,
    search: PropTypes.any,
    menuProps: PropTypes.object,
    profileProps: PropTypes.object,
    searchProps: PropTypes.object,
  }

  static defaultProps = {
    className: '',
    profileProps: {},
    searchProps: {}
  }

  constructor(props) {
    super(props);

    this._inputRef = React.createRef();
    this.state = {
      searchMode: false
    };
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

  componentWillUnmount() {
    clearTimeout(this._resizeTimer);
  }

  handleChange = (e) => {
    this.props.onChange && this.props.onChange(e);
  }

  enterSearchMode = () => {
    this.setState({
      searchMode: true
    }, () => {
      if (this.state.searchMode) {
        this._inputRef.current && this._inputRef.current.focus();
      }
    });
  }

  leaveSearchMode = () => {
    this.setState({searchMode: false});
  }

  render() {
    const {project, className, search, style, collapsed, noSider,  theme, searchProps, menuProps, profileProps} = this.props;
    const {nick, avatar, dropdownProps, hasSetting} = profileProps;
    searchProps.inputProps = Object.assign(searchProps.inputProps || {}, {ref: this._inputRef, onBlur: this.leaveSearchMode});

    return (
      <Layout.Header className={'hc-header ' + className + (theme ? ' hc-header-' + theme : '')} style={style} >
        {project}
        {noSider ? null : (<Icon
          className='hc-header-trigger'
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggleClick} />)}
        <div className='hc-header-right' style={{display: nick === false ? 'none' : ''}}>
          {search !== undefined ? search : (<span
            className={'hc-header-search ' + (this.state.searchMode ? 'hc-header-search-show' : '')}
            onClick={this.enterSearchMode}>
            <Search
              placeholder={this.getLocale('searchPlaceholder')}
              onSelect={v => this.handleChange({value: v, key: 'search'})}
              {...searchProps}
            /></span>)
          }{nick ? (
            <Dropdown
              overlay={(
                <Menu className='hc-header-menu' selectedKeys={[]} onClick={this.handleChange} {...dropdownProps}>
                  <Menu.Item key="profile"><Icon type="user" />{this.getLocale('profile')}</Menu.Item>
                  {hasSetting ? (<Menu.Item key="setting"><Icon type="setting" />{this.getLocale('setting')}</Menu.Item>) : null}
                  <Menu.Divider />
                  <Menu.Item key="logout"><Icon type="logout" />{this.getLocale('logout')}</Menu.Item>
                </Menu>
              )}>
              <span className='hc-header-account'>
                {avatar && (<Avatar size="small" className='hc-header-avatar' src={avatar} />)} {nick}
              </span>
            </Dropdown>
          ) : (<Spin size="small" style={{marginLeft: 8}} />)}
        </div>
        {menuProps ? (<Sider {...menuProps} />) : null}
      </Layout.Header>
    );
  }
}
