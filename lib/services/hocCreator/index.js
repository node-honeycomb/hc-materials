"use strict";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var prop_types_1 = require("prop-types");

var dataSet_1 = require("../../components/dataSet");

var HocCreator =
/** @class */
function () {
  function HocCreator() {
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


  HocCreator.prototype.getModalComponent = function (Widget, modalOption, richProps) {
    var modalType = modalOption.modalType || 'open'; // 有richProps说明是一个动态数据的组件

    if (richProps) {
      Widget = this.getRichComponent(Widget, richProps);
    }

    var option = _extends({
      content: React.createElement(Widget, modalOption.childProps)
    }, modalOption.modalProps);

    var modal = this.context.modal[modalType](option); // 多个对话框可以叠加

    if (modalOption.standalone) {
      this._modals.push(modal);
    } else {
      // 否则把之前的对话框干掉，只显示当前的
      this._modals[0] && this._modals[0].destroy();
      this._modals[0] = modal;
    }

    return modal;
  };

  HocCreator.prototype.destroy = function () {
    var modal = this._modals.pop();

    while (modal) {
      modal.destroy();
      modal = this._modals.pop();
    }
  };

  HocCreator.prototype.getRichComponent = function (Widget, richProps) {
    var RichWidget =
    /** @class */
    function (_super) {
      __extends(RichWidget, _super);

      function RichWidget() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      RichWidget.prototype.getRealInstance = function () {
        return this._wrappedComponent;
      };

      RichWidget.prototype.handleResolve = function (v, params) {
        this._wrappedComponent.handleResolve(v, params);
      };

      RichWidget.prototype.render = function () {
        var _this = this;

        if (richProps.childProps) {
          _extends(richProps.childProps, this.props);
        }

        return React.createElement(dataSet_1.DataSet, _extends({
          ref: function ref(inst) {
            return _this._wrappedComponent = inst;
          }
        }, richProps), React.createElement(Widget, null));
      };

      return RichWidget;
    }(react_1["default"].PureComponent);

    return RichWidget;
  };

  HocCreator.contextTypes = {
    modaler: prop_types_1["default"].object.isRequired
  };
  return HocCreator;
}();

exports.HocCreator = HocCreator;