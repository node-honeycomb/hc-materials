function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import React from 'react';
import { bool, number, object, string } from 'prop-types';
var initialState = {
  terminatingAnimationTimeout: null,
  percent: 0,
  progressInterval: null
};
var DEFAULT_SCOPE = 'default';
var UPDATE_TIME = 200;
var MAX_PROGRESS = 99;
var PROGRESS_INCREASE = 10;
export var LoadingBar =
/*#__PURE__*/
function (_React$Component) {
  _inherits(LoadingBar, _React$Component);

  function LoadingBar(props) {
    var _this;

    _classCallCheck(this, LoadingBar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LoadingBar).call(this, props));
    _this.state = _extends({}, initialState, {
      loading: LoadingBar.instances[props.scope] === undefined ? props.loading : LoadingBar.instances[props.scope].loading
    });
    _this.style = {
      opacity: '0',
      transform: 'scaleX(0)',
      transformOrigin: 'left',
      width: '100%',
      willChange: 'transform, opacity'
    }; // Use default styling if there's no CSS class applied

    if (!_this.props.className) {
      _this.style.height = '3px';
      _this.style.backgroundColor = 'red';
      _this.style.position = 'absolute';
    }

    _extends(_this.style, _this.props.style);

    _this.boundSimulateProgress = _this.simulateProgress.bind(_assertThisInitialized(_this));
    _this.boundResetProgress = _this.resetProgress.bind(_assertThisInitialized(_this));
    LoadingBar.instances[props.scope] = _assertThisInitialized(_this);
    return _this;
  }

  _createClass(LoadingBar, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Re-render the component after mount to fix problems with SSR and CSP.
      //
      // Apps that use Server Side Rendering and has Content Security Policy for style
      // that doesn't allow inline styles should render an empty div and replace it
      // with the actual Loading Bar after mount See:
      // https://github.com/mironov/react-redux-loading-bar/issues/39
      //
      // eslint-disable-next-line react/no-did-mount-set-state
      this.mounted = true;

      if (this.state.loading > 0) {
        this.launch();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mounted = false;
      clearInterval(this.state.progressInterval);
      clearTimeout(this.state.terminatingAnimationTimeout);
    }
  }, {
    key: "handleUpdate",
    value: function handleUpdate(nextProps) {
      if (this.shouldStart(nextProps)) {
        this.launch();
      } else if (this.shouldStop(nextProps)) {
        if (this.state.percent === 0 && !this.props.showFastActions) {
          // not even shown yet because the action finished quickly after start
          clearInterval(this.state.progressInterval);
          this.resetProgress();
        } else {
          // should progress to 100 percent
          this.setState({
            percent: 100
          });
        }
      }
    }
  }, {
    key: "shouldStart",
    value: function shouldStart(nextProps) {
      if (!this.state.loading && nextProps.loading > 0) {
        this.setState({
          loading: nextProps.loading
        });
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "shouldStop",
    value: function shouldStop(nextProps) {
      if (this.state.progressInterval && nextProps.loading === 0) {
        this.setState({
          loading: nextProps.loading
        });
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "shouldShow",
    value: function shouldShow() {
      return this.state.percent > 0 && this.state.percent <= 100;
    }
  }, {
    key: "launch",
    value: function launch() {
      var percent = this.state.percent;
      var terminatingAnimationTimeout = this.state.terminatingAnimationTimeout;
      var loadingBarNotShown = !this._progressInterval;
      var terminatingAnimationGoing = percent === 100;

      if (loadingBarNotShown) {
        this._progressInterval = setInterval(this.boundSimulateProgress, this.props.updateTime);
      }

      if (terminatingAnimationGoing) {
        clearTimeout(terminatingAnimationTimeout);
      }

      percent = 0;
      this.setState({
        progressInterval: this._progressInterval,
        percent: percent
      });
    }
  }, {
    key: "newPercent",
    value: function newPercent() {
      var percent = this.state.percent;
      var progressIncrease = this.props.progressIncrease; // Use cos as a smoothing function Can be any function to slow down progress
      // near the 100%

      var smoothedProgressIncrease = progressIncrease * Math.cos(percent * (Math.PI / 2 / 100));
      return percent + smoothedProgressIncrease;
    }
  }, {
    key: "simulateProgress",
    value: function simulateProgress() {
      var _this$state = this.state,
          progressInterval = _this$state.progressInterval,
          percent = _this$state.percent,
          terminatingAnimationTimeout = _this$state.terminatingAnimationTimeout;
      var maxProgress = this.props.maxProgress;

      if (percent === 100) {
        clearInterval(progressInterval);
        terminatingAnimationTimeout = setTimeout(this.boundResetProgress, LoadingBar.TERMINATING_ANIMATION_TIME);
        progressInterval = null;
      } else if (this.newPercent() <= maxProgress) {
        percent = this.newPercent();
      }

      this.setState({
        percent: percent,
        progressInterval: progressInterval,
        terminatingAnimationTimeout: terminatingAnimationTimeout
      });
    }
  }, {
    key: "resetProgress",
    value: function resetProgress() {
      this._progressInterval = null;
      this.setState(initialState);
    }
  }, {
    key: "buildStyle",
    value: function buildStyle() {
      var animationTime = this.state.percent !== 100 ? LoadingBar.ANIMATION_TIME : LoadingBar.TERMINATING_ANIMATION_TIME;
      this.style = _extends({}, this.style, {
        transform: "scaleX(".concat(this.state.percent / 100, ")"),
        transition: "transform ".concat(animationTime, "ms linear"),
        opacity: this.shouldShow() ? '1' : '0'
      });
      return this.style;
    }
  }, {
    key: "render",
    value: function render() {
      // In order not to violate strict style CSP it's better to make an extra
      // re-render after component mount
      if (!this.mounted) {
        return React.createElement("div", null);
      }

      return React.createElement("div", null, React.createElement("div", {
        style: this.buildStyle(),
        className: this.props.className
      }), React.createElement("div", {
        style: {
          display: 'table',
          clear: 'both'
        }
      }));
    }
  }], [{
    key: "showLoading",
    value: function showLoading() {
      var scope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_SCOPE;
      var instance = LoadingBar.instances[scope];

      if (instance && instance.handleUpdate) {
        instance.handleUpdate({
          loading: (instance.state.loading || 0) + 1
        });
      } else {
        LoadingBar.instances[scope] = (LoadingBar.instances[scope] || 0) + 1;
      }
    }
  }, {
    key: "hideLoading",
    value: function hideLoading() {
      var scope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_SCOPE;
      var instance = LoadingBar.instances[scope];

      if (instance && instance.handleUpdate) {
        instance.handleUpdate({
          loading: Math.max(0, (instance.state.loading || 1) - 1)
        });
      }
    }
  }, {
    key: "resetLoading",
    value: function resetLoading() {
      var scope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_SCOPE;
      var instance = LoadingBar.instances[scope];

      if (instance && instance.handleUpdate) {
        instance.handleUpdate({
          loading: 0
        });
      }
    }
  }]);

  return LoadingBar;
}(React.Component);
LoadingBar.UPDATE_TIME = UPDATE_TIME;
LoadingBar.MAX_PROGRESS = MAX_PROGRESS;
LoadingBar.PROGRESS_INCREASE = PROGRESS_INCREASE;
LoadingBar.ANIMATION_TIME = UPDATE_TIME * 4;
LoadingBar.TERMINATING_ANIMATION_TIME = UPDATE_TIME / 2;
LoadingBar.instances = {};

LoadingBar.create = function () {
  var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (action, next) {
    if (action.type && !action.suppressGlobalProgress) {
      if (action.type.match(/\/start$/)) {
        LoadingBar.showLoading(opt.name);
      } else if (action.type.match(/\/success$/) || action.type.match(/\/error$/)) {
        LoadingBar.hideLoading(opt.name);
      }
    }

    next(action);
  };
};

LoadingBar.propTypes = {
  className: string,
  loading: number,
  maxProgress: number,
  progressIncrease: number,
  showFastActions: bool,
  updateTime: number,
  // eslint-disable-next-line react/no-unused-prop-types
  scope: string,
  // eslint-disable-next-line react/forbid-prop-types
  style: object
};
LoadingBar.defaultProps = {
  className: '',
  loading: 0,
  maxProgress: MAX_PROGRESS,
  progressIncrease: PROGRESS_INCREASE,
  showFastActions: false,
  style: {},
  updateTime: UPDATE_TIME,
  scope: DEFAULT_SCOPE
};