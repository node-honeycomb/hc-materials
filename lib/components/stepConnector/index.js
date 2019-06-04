"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StepConnector = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _antd = require("antd");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var StepConnector =
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
      var steps = this.props.steps;
      return _react["default"].createElement(_antd.Anchor, {
        affix: false,
        className: "hc-stepConnector"
      }, steps.map(function (step, index) {
        return [_react["default"].createElement("div", {
          key: index,
          className: "hc-stepConnector-elem-step"
        }, _react["default"].createElement("button", {
          tabIndex: index,
          type: "button",
          className: "hc-stepConnector-elem-step_btn",
          onClick: function onClick() {
            return _this2.handleStep(index, step.tab);
          }
        }, _react["default"].createElement("div", null, _react["default"].createElement("span", {
          className: 'hc-stepConnector-elem-step_span' + (activeStep === index && !step.id ? ' active' : '')
        }, _react["default"].createElement(_antd.Anchor.Link, {
          href: '#' + step.id,
          title: _react["default"].createElement("span", null, _react["default"].createElement("svg", {
            viewBox: "0 0 24 24"
          }, _react["default"].createElement("circle", {
            cx: "12",
            cy: "12",
            r: "10"
          }), _react["default"].createElement("text", {
            x: "12",
            y: "16"
          }, index + 1)), step.text)
        }))))), steps.length - index > 1 ? _react["default"].createElement("div", {
          className: "hc-stepConnector-elem-connector"
        }, _react["default"].createElement("span", null)) : null];
      }));
    }
  }]);

  return StepConnector;
}(_react["default"].PureComponent);

exports.StepConnector = StepConnector;
StepConnector.propTypes = {
  nonLinear: _propTypes["default"].object,
  height: _propTypes["default"].number,
  steps: _propTypes["default"].array,
  completed: _propTypes["default"].bool,
  activeStep: _propTypes["default"].number
};