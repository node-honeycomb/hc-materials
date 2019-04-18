import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Modal from 'antd/lib/modal';

export class Modaler {
  static propTypes = {
    app: PropTypes.object.isRequired
  }

  set(name, value) {
    if (Object(name) === name) {
      Object.assign(this._cfg, name);
    } else {
      this._cfg[name] = value;
    }
  }

  constructor(context) {
    this.context = context;
    this._modals = [];
    this._cfg = {
      width: 520,
      container: this.context.app.storeContainer
    };
    ['info', 'success', 'error', 'warning', 'confirm'].forEach(action => {
      this[action] = (dialogProps) => {
        if (!dialogProps.getContainer) {
          dialogProps.getContainer = () => context.app.storeContainer;
        }
        dialogProps.width = dialogProps.width || this._cfg.width;
        const closeModal = Modal[action](dialogProps);

        this._modals.push({destroy: closeModal});
        return this._modals[this._modals.length - 1];
      };
    });
    this.wrapperDiv = document.createElement('div');
    document.body.appendChild(this.wrapperDiv);
  }

  open({content, ...dialogProps}) {
    const Dialog = () => {
      const [state, setState] = useState({
        visible: true,
        getContainer: () => this._cfg.container,
        onOk: () => this.trigger(dialogProps.onOk, setState),
        onCancel: () => this.trigger(dialogProps.onCancel, setState),
        width: dialogProps.width || this._cfg.width
      });
      this._modals.push({
        destroy: () => setState({visible: false})
      });
      return (<Modal {...dialogProps} {...state}>{content}</Modal>);
    };
    ReactDOM.render((<Dialog />), this.wrapperDiv);

    return this._modals[this._modals.length - 1];
  }

  trigger(actionFn, setState) {
    const closeModal = () => setState({visible: false});
    if (actionFn) {
      const ret = actionFn(closeModal);
      if (ret && ret.then) {
        ret.then(() => {
          // It's unnecessary to set loading=false, for the Modal will be unmounted after
          setState({confirmLoading: true});
        }, () => {
          setState({confirmLoading: false});
        }).catch(() => {
          setState({confirmLoading: false});
        });
      } else if (ret !== false) {
        closeModal();
      }
    } else {
      closeModal();
    }
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
