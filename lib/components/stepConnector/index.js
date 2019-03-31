"use strict";

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

var anchor_1 = require("antd/lib/anchor");

var StepConnector =
/** @class */
function (_super) {
  __extends(StepConnector, _super);

  function StepConnector(props) {
    var _this = _super.call(this, props) || this;

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

  StepConnector.prototype.componentDidUpdate = function (prevProps, prevState) {
    if (this.props.activeStep !== undefined && this.props.activeStep !== prevState.activeStep) {
      this.handleStep(this.props.activeStep, this.props.steps[this.props.activeStep].tab);
    }
  };

  StepConnector.prototype.render = function () {
    var _this = this;

    var activeStep = this.state.activeStep;
    var steps = this.props.steps;
    return React.createElement(anchor_1["default"], {
      affix: false,
      className: "hc-stepConnector"
    }, steps.map(function (step, index) {
      return [React.createElement("div", {
        key: index,
        className: "hc-stepConnector-elem-step"
      }, React.createElement("button", {
        tabIndex: index,
        type: "button",
        className: "hc-stepConnector-elem-step_btn",
        onClick: function onClick() {
          return _this.handleStep(index, step.tab);
        }
      }, React.createElement("div", null, React.createElement("span", {
        className: 'hc-stepConnector-elem-step_span' + (activeStep === index ? ' active' : '')
      }, React.createElement("span", null, React.createElement("svg", {
        viewBox: "0 0 24 24"
      }, React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "10"
      }), React.createElement("text", {
        x: "12",
        y: "16"
      }, index + 1))), React.createElement(anchor_1["default"].Link, {
        href: '#' + step.id,
        title: step.text
      }))))), steps.length - index > 1 ? React.createElement("div", {
        className: "hc-stepConnector-elem-connector"
      }, React.createElement("span", null)) : null];
    }));
  };

  StepConnector.propTypes = {
    nonLinear: prop_types_1["default"].object,
    height: prop_types_1["default"].number,
    steps: prop_types_1["default"].array,
    completed: prop_types_1["default"].bool,
    activeStep: prop_types_1["default"].number
  };
  return StepConnector;
}(react_1["default"].PureComponent);

exports.StepConnector = StepConnector;