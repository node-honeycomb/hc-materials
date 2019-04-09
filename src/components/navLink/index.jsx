import React from 'react';
import PropTypes from 'prop-types';
import Menu from 'antd/lib/menu';
import Button from 'antd/lib/button';
import Dropdown from 'antd/lib/dropdown';
import Icon from 'antd/lib/icon';
import {localeContext} from '../../core/localeContext';

@localeContext('NavLink', {
  more: '更多'
})
export class NavLink extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,

    links: PropTypes.array,
    menus: PropTypes.array,
    onClick: PropTypes.func,
    data: PropTypes.any,
    menuLabel: PropTypes.any
  }

  static defaultProps = {
    className: '',
    links: [],
    menus: []
  }

  setAction(key, flag) {
    let item;
    if (Object(key) === key) {
      item = key;
    } else {
      item = this.props.links.find(item => item.key === key) ||
      this.props.menus.find(item => item.key === key);
    }

    if (item.propName) {
      item[item.propName] = flag;
    }

    this.forceUpdate();

    return item;
  }

  handleClick(e) {
    const key = e.key;

    const item = this.setAction(key, true);
    const action = item.action || this.props.onClick;

    const cancelCallback = () => {
      this.setAction(item, false);
    };
    if (action) {
      if (!action(e, this.props.data, cancelCallback)) {
        cancelCallback();
      }
    } else {
      cancelCallback();
    }
  }

  render() {
    const handleClick = this
      .handleClick
      .bind(this);
    const {links, menus, data, className, style} = this.props;
    const menu = (
      <Menu onClick={(e) => handleClick(e)} className="hc-navLink-dropdown_link">
        {menus.map((item, index) => {
          const propsByState = item.getProps ? item.getProps(data) : {};
          return (
            <Menu.Item
              key={item.key || index}
              disabled={item.disabled}
              loading={item.loading}
              {...propsByState}>
              <a>{item.render ? item.render() : item.name}</a>
            </Menu.Item>
          );
        })}
      </Menu>
    );
    return (
      <div className={'hc-navLink ' + className} style={style}>
        {links.map((item, index) => {
          const propsByState = item.getProps ? item.getProps(data) : {};
          return (<Button
            size={item.size ? item.size : 'small'}
            type={item.type ? item.type : 'button'}
            className={item.type ? '' : 'ant-btn-link'}
            key={item.key || index}
            disabled={item.disabled}
            loading={item.loading}
            onClick={() => handleClick(item)}
            {...propsByState}
          >{item.href ?
              (
                <a href={item.href} target={item.target || '_blank'}>{item.render ? item.render() : item.name}</a>
              ) :
              (
                <span>{item.render ? item.render() : item.name}</span>
              )}</Button>);
        })}
        {menus.length ? (this.props.menuLabel ?
          (
            <Dropdown.Button overlay={menu}>
              {this.props.menuLabel}
            </Dropdown.Button>
          ) :
          (
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link ant-btn-link">
                {this.getLocale().more}
                <Icon type="down" />
              </a>
            </Dropdown>
          )) : null}
      </div>
    );
  }
}
