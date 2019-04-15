import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Modal from 'antd/lib/modal';

export class Modaler {
  static propTypes = {
    app: PropTypes.object.isRequired
  }

  constructor(context) {
    this._modals = [];
    ['info', 'success', 'error', 'warning', 'confirm'].forEach(action => {
      this[action] = (dialogProps) => {
        if (!dialogProps.getContainer) {
          dialogProps.getContainer = () => context.app.storeContainer;
        }
        const closeModal = Modal[action](dialogProps);

        this._modals.push({destroy: closeModal});
        return this._modals[this._modals.length - 1];
      };
    });
  }

  open({content, ...dialogProps}) {
    const Dialog = () => {
      const [state, setState] = useState({visible: true, getContainer: () => this.context.app.storeContainer});
      this._modals.push({
        destroy: () => setState({visible: false})
      });
      return (<Modal {...dialogProps} {...state}>{content}</Modal>);
    };
    ReactDOM.render((<Dialog />), document.body);

    return this._modals[this._modals.length - 1];
  }

  clear() {
    let modal = this._modals.pop();
    while (modal) {
      modal.destroy();
      modal = this._modals.pop();
    }
  }

  destroy() {
    this.clear();
  }
}
