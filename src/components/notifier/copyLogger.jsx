import React from 'react';
import PropTypes from 'prop-types';

import Clipboard from 'clipboard';
import message from 'antd/lib/message';
import Button from 'antd/lib/button';
import {localeContext} from '../../core/localeContext';

@localeContext('CopyLogger')
export class CopyLogger extends React.PureComponent {
  static propTypes = {
    rid: PropTypes.string,
    message: PropTypes.string
  }

  _triggerRef = React.createRef();
  componentDidMount() {
    /**
     * copy:
     * see: https://clipboardjs.com/
     */
    this._clipboard = new Clipboard(this._triggerRef.current);

    this._clipboard.on('success', (e) => {
      message.info(this.getLocale().copySuccess);
      e.clearSelection();
    });
  }

  componentWillUnmount() {
    this._clipboard.destroy();
  }

  render() {
    const inlineStyle = {
      marginRight: '40px',
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      wordBreak: 'break-all',
      lineHeight: '22px'
    };
    return (
      <div style={{whiteSpace: 'nowrap'}}>
        <Button
          style={{float: 'right'}}
          ref={this._triggerRef}
          size="small"
          type="ghost"
          data-clipboard-text={this.props.rid}
        >{this.getLocale().copy}</Button>
        <span style={inlineStyle}>{this.props.message}</span>
      </div>
    );
  }
}
