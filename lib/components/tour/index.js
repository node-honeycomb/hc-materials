"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tour = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactJoyride = _interopRequireDefault(require("react-joyride"));

var _localeContext = require("../../core/localeContext");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = void 0 && (void 0).__metadata || function (k, v) {
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var types = ['continuous', 'single'];

var Tour =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Tour, _React$Component);

  function Tour(props, context) {
    var _this;

    _classCallCheck(this, Tour);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Tour).call(this, props));

    _this.handleFocus = function (e) {
      _this.setState({
        selector: e.type === 'tooltip:before' ? e.step.selector : ''
      });
    };

    _this.state = {
      joyrideOverlay: props.mask || true,
      joyrideType: props.type || types[0],
      isRunning: props.visible || false,
      stepIndex: 0,
      steps: [],
      selector: ''
    };
    _this._defaultSteps = [];

    if (Array.isArray(props.steps)) {
      _this.state.steps = props.steps;
    } else {
      if (_this.props.steps.steps) {
        _this._defaultSteps = _this.props.steps.steps;
      }

      context.history.listen(function (location, action) {
        if (action.location) {
          var step = _this.props.steps[action.location.pathname];

          if (step) {
            clearTimeout(_this._timer);
            _this._timer = setTimeout(function () {
              if (step.type) {
                _this._switch(step.type, step.mask);
              } else {
                _this.setState({
                  joyrideType: types[0]
                });
              }

              _this.addSteps(step.steps, function () {
                if (step.tip) {
                  _this.addTooltip(step.tip);
                }
              }, step.action);
            }, 300);
          } else {
            if (_this._defaultSteps[0] && document.querySelector(_this._defaultSteps[0].selector)) {
              _this.setState({
                steps: _this._defaultSteps
              });
            }
          }
        }
      });
    }

    return _this;
  }

  _createClass(Tour, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      if (this.props.visible !== false) {
        setTimeout(function () {
          if (!_this2.state.isRunning) {
            _this2.setState({
              steps: _this2._defaultSteps,
              isRunning: true
            });
          }
        }, 1000);
      }
    }
  }, {
    key: "addSteps",
    value: function addSteps(steps, callback, action) {
      var newSteps = steps;

      if (!Array.isArray(newSteps)) {
        newSteps = [newSteps];
      }

      if (!newSteps.length) {
        return;
      }

      if (action === 'replace') {
        this.setState({
          isRunning: true,
          steps: newSteps
        }, callback);
      } else if (action === 'push') {
        // Force setState to be synchronous to keep step order.
        this.setState(function (currentState) {
          currentState.steps = currentState.steps.concat(newSteps);
          callback && callback();
          return currentState;
        });
      } else {
        var _steps;

        var stepIndex = 0;

        if (action) {
          var idx = this._defaultSteps.findIndex(function (item) {
            return item.tag === action;
          });

          if (idx > -1) {
            stepIndex = idx + 1;
            _steps = this._defaultSteps.slice(0, idx + 1).concat(newSteps).concat(this._defaultSteps.slice(idx + 1));
          } else {
            _steps = newSteps.concat(this._defaultSteps);
          }
        } else {
          _steps = this._defaultSteps.concat(newSteps);
        }

        this.setState({
          isRunning: true,
          stepIndex: stepIndex,
          steps: _steps
        }, callback);
      }
    }
  }, {
    key: "addTooltip",
    value: function addTooltip(data) {
      this._joyride.addTooltip(data);
    }
  }, {
    key: "next",
    value: function next() {
      this._joyride.next();
    }
  }, {
    key: "_switch",
    value: function _switch(type, mask) {
      var _this3 = this;

      if (type === types[0]) {
        this._joyride && this._joyride.reset();
        this.setState({
          isRunning: false,
          joyrideType: type,
          joyrideOverlay: mask
        });
        clearTimeout(this._timer);
        this._timer = setTimeout(function () {
          _this3.setState({
            isRunning: true
          });
        }, 300);
      } else {
        this.setState({
          joyrideType: type,
          joyrideOverlay: mask
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$state = this.state,
          isRunning = _this$state.isRunning,
          joyrideOverlay = _this$state.joyrideOverlay,
          joyrideType = _this$state.joyrideType,
          selector = _this$state.selector,
          stepIndex = _this$state.stepIndex,
          steps = _this$state.steps;
      return _react["default"].createElement(_reactJoyride["default"], {
        ref: function ref(inst) {
          return _this4._joyride = inst;
        },
        callback: this.handleFocus,
        debug: false,
        disableOverlay: selector === '.j-tour-ticket',
        locale: this.getLocale(),
        run: isRunning,
        showOverlay: joyrideOverlay,
        showSkipButton: true,
        showStepsProgress: true,
        stepIndex: stepIndex,
        steps: steps,
        type: joyrideType
      });
    }
  }]);

  return Tour;
}(_react["default"].Component);

exports.Tour = Tour;
Tour.contextTypes = {
  history: _propTypes["default"].object
};
Tour.propTypes = {
  steps: _propTypes["default"].object,
  type: _propTypes["default"].bool,
  mask: _propTypes["default"].bool,
  visible: _propTypes["default"].bool
};
exports.Tour = Tour = __decorate([(0, _localeContext.localeContext)('Tour'), __metadata("design:paramtypes", [Object, Object])], Tour);