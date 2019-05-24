import React from 'react';
import PropTypes from 'prop-types';
import {DropTarget} from 'react-dnd';

/* eslint-disable new-cap */
@DropTarget((props) => {
  return props.types;
}, {
  drop: (props, monitor) => { // component
    const type = monitor.getItemType();
    const data = monitor.getItem().data;
    monitor.targetProps = props;
    if (props.types.indexOf(type) > -1) {
      props.doAction(type, data, monitor);
    } else {
      props.doAction(type, data, monitor);
    }
  }
}, (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
})
export class DropItem extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,

    types: PropTypes.array.isRequired,
    doAction: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func,
    canDrop: PropTypes.bool,
    isOver: PropTypes.bool,
    children: PropTypes.any,
    htmlFor: PropTypes.object
  }
  static defaultProps = {
    className: '',
    htmlFor: {}
  }

  render() {
    let className = this.props.className;
    if (this.props.canDrop) {
      className += ' j-com-drop';
    }
    if (this.props.isOver) {
      className += ' j-com-drop-over';
    }
    return this
      .props
      .connectDropTarget(
        <div className={className} style={this.props.style} {...this.props.htmlFor}>{this.props.children}</div>
      );
  }
}
