import React from 'react';
import PropTypes from 'prop-types';
import {DragSource} from 'react-dnd';

/* eslint-disable new-cap */
@DragSource((props) => {
  return props.type;
}, {
  beginDrag: (props, monitor) => {
    props.doAction(props.type, props.data, monitor);
    return {data: props.data};
  },
  endDrag: (props, monitor) => {
    props.doAction(props.type, props.data, monitor);
  }
}, (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
})
export class DragItem extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,

    type: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    doAction: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func,
    isDragging: PropTypes.bool,
    children: PropTypes.any,
    htmlFor: PropTypes.object
  }
  static defaultProps = {
    className: '',

    doAction: noop => noop,
    htmlFor: {}
  }
  render() {
    let className = this.props.className;
    if (this.props.isDragging) {
      className += ' j-com-drag';
    }
    return this
      .props
      .connectDragSource(
        <div className={className} style={this.props.style} {...this.props.htmlFor}>{this.props.children}</div>
      );
  }
}
