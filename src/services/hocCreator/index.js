import React from 'react';
import PropTypes from 'prop-types';
import {DataSet} from '../../components/dataSet';

export class HocCreator {
  static contextTypes = {
    modaler: PropTypes.object.isRequired
  }

  constructor(context) {
    this.context = context;
    this._modals = [];
  }
  /**
   * modalOption = {
   *  // 对话框的配置
   *  modalProps,
   *  // 对话框打开类型
   *  modalType,
   *  // 独立打开
   *  standalone,
   *  // 子组件的属性
   *  childProps
   * }
   */
  getModalComponent(Widget, modalOption, richProps) {
    const modalType = modalOption.modalType || 'open';
    // 有richProps说明是一个动态数据的组件
    if (richProps) {
      Widget = this.getRichComponent(Widget, richProps);
    }
    const option = Object.assign({
      content: (<Widget {...modalOption.childProps} />),
    }, modalOption.modalProps);

    const modal = this.context.modaler[modalType](option);

    // 多个对话框可以叠加
    if (modalOption.standalone) {
      this._modals.push(modal);
    } else {
      // 否则把之前的对话框干掉，只显示当前的
      this._modals[0] && this._modals[0].destroy();
      this._modals[0] = modal;
    }
    return modal;
  }

  destroy() {
    let modal = this._modals.pop();
    while (modal) {
      modal.destroy();
      modal = this._modals.pop();
    }
  }

  getRichComponent(Widget, richProps) {
    class RichWidget extends React.PureComponent {
      _wrapRef = React.createRef();
      getRealInstance() {
        return this._wrapRef.current;
      }

      handleResolve(v, params) {
        this._wrapRef.current.handleResolve(v, params);
      }

      render() {
        if (richProps.childProps) {
          Object.assign(richProps.childProps, this.props);
        } else {
          richProps.childProps = Object.assign({}, this.props);
        }
        return (<DataSet
          ref={this._wrapRef}
          {...richProps}>
          <Widget />
        </DataSet>);
      }
    }
    return RichWidget;
  }
}
