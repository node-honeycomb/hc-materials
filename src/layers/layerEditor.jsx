import React from 'react';
import PropTypes from 'prop-types';

import {Card} from 'antd';
// 有点问题
const types = ['hc', 'custom', 'antd', 'material'];
// https://github.com/swagger-api/swagger-editor/blob/2cc957f755a72fcc005c084f689810ce468d2571/src/plugins/editor/components/editor.jsx

export class LayerGrid extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.any,
    style: PropTypes.object
  }
  render() {
    return (<div className={this.props.className} style={this.props.style}>{this.props.children}</div>);
  }
}

let __guid__ = 1;
function guid(prefix) {
  return prefix + __guid__++;
}
function wrapper({children}) {
  return children;
}
export class LayerItem extends React.PureComponent {
  static contextTypes = {
    layer: PropTypes.object
  }
  static propTypes = {
    title: PropTypes.string,
    disabled: PropTypes.bool,
    children: PropTypes.element,
    onChange: PropTypes.func,
    cardProps: PropTypes.object,
    style: PropTypes.object,
    menu: PropTypes.any
  }
  static defaultProps = {
    cardProps: {}
  }

  constructor(props, context) {
    super(props);

    this.state = {
      active: false,
      guid: guid('layerItem'),
    };
    context.layer.register(this.state.guid, (active) => {
      this.setState({
        active: active
      });
    });
  }

  render() {
    const layer = this.context.layer;
    // const ItemWrapper = layer.isEditable() ? DropItem : wrapper;
    const ItemWrapper = wrapper;
    const {title, children, disabled, onChange, cardProps, menu} = this.props;
    return (<Card
      className={'hc-editor-layerItem ' + (this.state.active ? 'active' : '')}
      onClick={() => {
        layer.handleActive(this.state.guid);
      }}
      style={this.props.style}
      title={title}
      extra={disabled || !layer.isEditable() ? null : menu}
      {...cardProps}
    >
      <ItemWrapper types={types} doAction={(type, item) => {
        const target = {
          id: this.state.guid,
          key: 'update',
          type: type,
          attrs: item.attrs
        };
        onChange && onChange(target);
      }}>{children}</ItemWrapper>
    </Card>);
  }
}
