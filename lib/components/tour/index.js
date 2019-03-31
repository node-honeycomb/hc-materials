"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var prop_types_1 = require("prop-types");

var react_joyride_1 = require("react-joyride");

var localeContext_1 = require("../../core/localeContext");

require("react-joyride/lib/react-joyride-compiled.css");

var types = ['continuous', 'single'];

var Tour =
/** @class */
function (_super) {
  __extends(Tour, _super);

  function Tour(props, context) {
    var _this = _super.call(this, props) || this;

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
          var step_1 = _this.props.steps[action.location.pathname];

          if (step_1) {
            clearTimeout(_this._timer);
            _this._timer = setTimeout(function () {
              if (step_1.type) {
                _this._switch(step_1.type, step_1.mask);
              } else {
                _this.setState({
                  joyrideType: types[0]
                });
              }

              _this.addSteps(step_1.steps, function () {
                if (step_1.tip) {
                  _this.addTooltip(step_1.tip);
                }
              }, step_1.action);
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

  Tour.prototype.componentDidMount = function () {
    var _this = this;

    if (this.props.visible !== false) {
      setTimeout(function () {
        if (!_this.state.isRunning) {
          _this.setState({
            steps: _this._defaultSteps,
            isRunning: true
          });
        }
      }, 1000);
    }
  };

  Tour.prototype.addSteps = function (steps, callback, action) {
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
      var steps_1;
      var stepIndex = 0;

      if (action) {
        var idx = this._defaultSteps.findIndex(function (item) {
          return item.tag === action;
        });

        if (idx > -1) {
          stepIndex = idx + 1;
          steps_1 = this._defaultSteps.slice(0, idx + 1).concat(newSteps).concat(this._defaultSteps.slice(idx + 1));
        } else {
          steps_1 = newSteps.concat(this._defaultSteps);
        }
      } else {
        steps_1 = this._defaultSteps.concat(newSteps);
      }

      this.setState({
        isRunning: true,
        stepIndex: stepIndex,
        steps: steps_1
      }, callback);
    }
  };

  Tour.prototype.addTooltip = function (data) {
    this._joyride.addTooltip(data);
  };

  Tour.prototype.next = function () {
    this._joyride.next();
  };

  Tour.prototype._switch = function (type, mask) {
    var _this = this;

    if (type === types[0]) {
      this._joyride && this._joyride.reset();
      this.setState({
        isRunning: false,
        joyrideType: type,
        joyrideOverlay: mask
      });
      clearTimeout(this._timer);
      this._timer = setTimeout(function () {
        _this.setState({
          isRunning: true
        });
      }, 300);
    } else {
      this.setState({
        joyrideType: type,
        joyrideOverlay: mask
      });
    }
  };

  Tour.prototype.render = function () {
    var _this = this;

    var _a = this.state,
        isRunning = _a.isRunning,
        joyrideOverlay = _a.joyrideOverlay,
        joyrideType = _a.joyrideType,
        selector = _a.selector,
        stepIndex = _a.stepIndex,
        steps = _a.steps;
    return React.createElement(react_joyride_1["default"], {
      ref: function ref(inst) {
        return _this._joyride = inst;
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
  };

  Tour.contextTypes = {
    history: prop_types_1["default"].object
  };
  Tour.propTypes = {
    steps: prop_types_1["default"].object,
    type: prop_types_1["default"].bool,
    mask: prop_types_1["default"].bool,
    visible: prop_types_1["default"].bool
  };
  Tour = __decorate([localeContext_1.localeContext('Tour'), __metadata("design:paramtypes", [Object, Object])], Tour);
  return Tour;
}(react_1["default"].Component);

exports.Tour = Tour;