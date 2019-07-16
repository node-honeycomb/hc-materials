function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Anchor } from 'antd';
export var StepConnector =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(StepConnector, _React$PureComponent);

  function StepConnector(props) {
    var _this;

    _classCallCheck(this, StepConnector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(StepConnector).call(this, props));

    _this.handleStep = function (activeStep, activeTab) {
      _this.props.steps.forEach(function (step) {
        var dom = step.getContainer ? step.getContainer(step.id) : document.getElementById(step.id);

        if (step.tab === activeTab) {
          dom.style.display = 'block';
        } else {
          dom.style.display = 'none';
        }
      });

      _this.setState({
        activeStep: activeStep,
        activeTab: activeTab
      });
    };

    var firstStep = props.steps[0] || {};
    _this.state = {
      activeStep: 0,
      activeTab: firstStep.tab
    };
    return _this;
  }

  _createClass(StepConnector, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.props.activeStep !== undefined && this.props.activeStep !== prevState.activeStep) {
        this.handleStep(this.props.activeStep, this.props.steps[this.props.activeStep].tab);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var activeStep = this.state.activeStep;
      var _this$props = this.props,
          steps = _this$props.steps,
          anchorProps = _this$props.anchorProps;
      return React.createElement(Anchor, _extends({
        affix: false,
        className: "hc-stepConnector"
      }, anchorProps), steps.map(function (step, index) {
        return React.createElement(Fragment, {
          key: index
        }, React.createElement("div", {
          className: "hc-stepConnector-elem-step"
        }, React.createElement("button", {
          tabIndex: index,
          type: "button",
          className: "hc-stepConnector-elem-step_btn",
          onClick: function onClick() {
            return _this2.handleStep(index, step.tab);
          }
        }, React.createElement("div", null, React.createElement("span", {
          className: 'hc-stepConnector-elem-step_span' + (activeStep === index && !step.id ? ' active' : '')
        }, React.createElement(Anchor.Link, {
          href: '#' + step.id,
          title: React.createElement("span", null, React.createElement("svg", {
            viewBox: "0 0 24 24"
          }, React.createElement("circle", {
            cx: "12",
            cy: "12",
            r: "10"
          }), React.createElement("text", {
            x: "12",
            y: "16"
          }, index + 1)), step.text)
        }))))), steps.length - index > 1 ? React.createElement("div", {
          className: "hc-stepConnector-elem-connector"
        }, React.createElement("span", null)) : null);
      }));
    }
  }]);

  return StepConnector;
}(React.PureComponent);
StepConnector.propTypes = {
  nonLinear: PropTypes.object,
  height: PropTypes.number,
  steps: PropTypes.array,
  completed: PropTypes.bool,
  activeStep: PropTypes.number,
  anchorProps: PropTypes.object
};