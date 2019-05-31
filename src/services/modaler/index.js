import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {Modal} from 'antd';

export class Modaler {
  static contextTypes = {
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
    const cfg = this._cfg;
    const context = this.context;
    const trigger = this.trigger.bind(this);
    const modals = this._modals;
    class Dialog extends React.PureComponent {
      static childContextTypes = Modaler.contextTypes;

      getChildContext() {
        return context;
      }

      constructor(props) {
        super(props);
        this.state = {
          visible: true,
          getContainer: () => cfg.container,
          onOk: () => trigger(dialogProps.onOk, this.setState.bind(this)),
          onCancel: () => trigger(dialogProps.onCancel, this.setState.bind(this)),
          width: dialogProps.width || cfg.width
        };

        modals.push({
          destroy: () => this.setState({visible: false})
        });
      }

      render() {
        return (<Modal {...dialogProps} {...this.state}>{content}</Modal>);
      }
    }

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
          closeModal();
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
