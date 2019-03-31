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

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var prop_types_1 = require("prop-types");

var initialState = {
  terminatingAnimationTimeout: null,
  percent: 0,
  progressInterval: null
};
var DEFAULT_SCOPE = 'default';
var UPDATE_TIME = 200;
var MAX_PROGRESS = 99;
var PROGRESS_INCREASE = 10;

var LoadingBar =
/** @class */
function (_super) {
  __extends(LoadingBar, _super);

  function LoadingBar(props) {
    var _this = _super.call(this, props) || this;

    _this.state = __assign({}, initialState, {
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

    _this.boundSimulateProgress = _this.simulateProgress.bind(_this);
    _this.boundResetProgress = _this.resetProgress.bind(_this);
    LoadingBar.instances[props.scope] = _this;
    return _this;
  }

  LoadingBar.showLoading = function (scope) {
    if (scope === void 0) {
      scope = DEFAULT_SCOPE;
    }

    var instance = LoadingBar.instances[scope];

    if (instance && instance.handleUpdate) {
      instance.handleUpdate({
        loading: (instance.state.loading || 0) + 1
      });
    } else {
      LoadingBar.instances[scope] = (LoadingBar.instances[scope] || 0) + 1;
    }
  };

  LoadingBar.hideLoading = function (scope) {
    if (scope === void 0) {
      scope = DEFAULT_SCOPE;
    }

    var instance = LoadingBar.instances[scope];

    if (instance && instance.handleUpdate) {
      instance.handleUpdate({
        loading: Math.max(0, (instance.state.loading || 1) - 1)
      });
    }
  };

  LoadingBar.resetLoading = function (scope) {
    if (scope === void 0) {
      scope = DEFAULT_SCOPE;
    }

    var instance = LoadingBar.instances[scope];

    if (instance && instance.handleUpdate) {
      instance.handleUpdate({
        loading: 0
      });
    }
  };

  LoadingBar.prototype.componentDidMount = function () {
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
  };

  LoadingBar.prototype.componentWillUnmount = function () {
    this.mounted = false;
    clearInterval(this.state.progressInterval);
    clearTimeout(this.state.terminatingAnimationTimeout);
  };

  LoadingBar.prototype.handleUpdate = function (nextProps) {
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
  };

  LoadingBar.prototype.shouldStart = function (nextProps) {
    if (!this.state.loading && nextProps.loading > 0) {
      this.setState({
        loading: nextProps.loading
      });
      return true;
    } else {
      return false;
    }
  };

  LoadingBar.prototype.shouldStop = function (nextProps) {
    if (this.state.progressInterval && nextProps.loading === 0) {
      this.setState({
        loading: nextProps.loading
      });
      return true;
    } else {
      return false;
    }
  };

  LoadingBar.prototype.shouldShow = function () {
    return this.state.percent > 0 && this.state.percent <= 100;
  };

  LoadingBar.prototype.launch = function () {
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
  };

  LoadingBar.prototype.newPercent = function () {
    var percent = this.state.percent;
    var progressIncrease = this.props.progressIncrease; // Use cos as a smoothing function Can be any function to slow down progress
    // near the 100%

    var smoothedProgressIncrease = progressIncrease * Math.cos(percent * (Math.PI / 2 / 100));
    return percent + smoothedProgressIncrease;
  };

  LoadingBar.prototype.simulateProgress = function () {
    var _a = this.state,
        progressInterval = _a.progressInterval,
        percent = _a.percent,
        terminatingAnimationTimeout = _a.terminatingAnimationTimeout;
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
  };

  LoadingBar.prototype.resetProgress = function () {
    this.setState(initialState);
  };

  LoadingBar.prototype.buildStyle = function () {
    var animationTime = this.state.percent !== 100 ? LoadingBar.ANIMATION_TIME : LoadingBar.TERMINATING_ANIMATION_TIME;
    this.style = _extends({}, this.style, {
      transform: "scaleX(" + this.state.percent / 100 + ")",
      transition: "transform " + animationTime + "ms linear",
      opacity: this.shouldShow() ? '1' : '0'
    });
    return this.style;
  };

  LoadingBar.prototype.render = function () {
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
  };

  LoadingBar.UPDATE_TIME = UPDATE_TIME;
  LoadingBar.MAX_PROGRESS = MAX_PROGRESS;
  LoadingBar.PROGRESS_INCREASE = PROGRESS_INCREASE;
  LoadingBar.ANIMATION_TIME = UPDATE_TIME * 4;
  LoadingBar.TERMINATING_ANIMATION_TIME = UPDATE_TIME / 2;
  LoadingBar.instances = {};

  LoadingBar.create = function (opt) {
    if (opt === void 0) {
      opt = {};
    }

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
    className: prop_types_1.string,
    loading: prop_types_1.number,
    maxProgress: prop_types_1.number,
    progressIncrease: prop_types_1.number,
    showFastActions: prop_types_1.bool,
    updateTime: prop_types_1.number,
    // eslint-disable-next-line react/no-unused-prop-types
    scope: prop_types_1.string,
    // eslint-disable-next-line react/forbid-prop-types
    style: prop_types_1.object
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
  return LoadingBar;
}(react_1["default"].Component);

exports.LoadingBar = LoadingBar;