import React from 'react';
import PropTypes from 'prop-types';
import Joyride from 'react-joyride';
import {localeContext} from '../../core/localeContext';

const types = ['continuous', 'single'];

@localeContext('Tour')
export class Tour extends React.Component {
  static contextTypes = {
    history: PropTypes.object
  }

  static propTypes = {
    steps: PropTypes.object,
    type: PropTypes.bool,
    mask: PropTypes.bool,
    visible: PropTypes.bool
  }

  constructor(props, context) {
    super(props);

    this.state = {
      joyrideOverlay: props.mask || true,
      joyrideType: props.type || types[0],
      isRunning: props.visible || false,
      stepIndex: 0,
      steps: [],
      selector: ''
    };
    this._defaultSteps = [];

    if (Array.isArray(props.steps)) {
      this.state.steps = props.steps;
    } else {
      if (this.props.steps.steps) {
        this._defaultSteps = this.props.steps.steps;
      }
      context
        .history
        .listen((location, action) => {
          if (action.location) {
            const step = this.props.steps[action.location.pathname];
            if (step) {
              clearTimeout(this._timer);
              this._timer = setTimeout(() => {
                if (step.type) {
                  this._switch(step.type, step.mask);
                } else {
                  this.setState({joyrideType: types[0]});
                }
                this.addSteps(step.steps, () => {
                  if (step.tip) {
                    this.addTooltip(step.tip);
                  }
                }, step.action);
              }, 300);
            } else {
              if (this._defaultSteps[0] && document.querySelector(this._defaultSteps[0].selector)) {
                this.setState({steps: this._defaultSteps});
              }
            }
          }
        });
    }
  }

  componentDidMount() {
    if (this.props.visible !== false) {
      setTimeout(() => {
        if (!this.state.isRunning) {
          this.setState({steps: this._defaultSteps, isRunning: true});
        }
      }, 1000);
    }
  }

  addSteps(steps, callback, action) {
    let newSteps = steps;

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
      this.setState(currentState => {
        currentState.steps = currentState
          .steps
          .concat(newSteps);
        callback && callback();
        return currentState;
      });
    } else {
      let steps;
      let stepIndex = 0;
      if (action) {
        const idx = this
          ._defaultSteps
          .findIndex(item => item.tag === action);
        if (idx > -1) {
          stepIndex = idx + 1;
          steps = this
            ._defaultSteps
            .slice(0, idx + 1)
            .concat(newSteps)
            .concat(this._defaultSteps.slice(idx + 1));
        } else {
          steps = newSteps.concat(this._defaultSteps);
        }
      } else {
        steps = this
          ._defaultSteps
          .concat(newSteps);
      }
      this.setState({
        isRunning: true,
        stepIndex: stepIndex,
        steps: steps
      }, callback);
    }
  }

  addTooltip(data) {
    this
      ._joyride
      .addTooltip(data);
  }

  next() {
    this
      ._joyride
      .next();
  }

  handleFocus = (e) => {
    this.setState({
      selector: e.type === 'tooltip:before' ? e.step.selector : ''
    });
  }

  _switch(type, mask) {
    if (type === types[0]) {
      this._joyride && this
        ._joyride
        .reset();

      this.setState({isRunning: false, joyrideType: type, joyrideOverlay: mask});
      clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        this.setState({isRunning: true});
      }, 300);
    } else {
      this.setState({joyrideType: type, joyrideOverlay: mask});
    }
  }

  render() {
    const {
      isRunning,
      joyrideOverlay,
      joyrideType,
      selector,
      stepIndex,
      steps
    } = this.state;

    return (<Joyride
      ref={inst => (this._joyride = inst)}
      callback={this.handleFocus}
      debug={false}
      disableOverlay={selector === '.j-tour-ticket'}
      locale={this.getLocale()}
      run={isRunning}
      showOverlay={joyrideOverlay}
      showSkipButton={true}
      showStepsProgress={true}
      stepIndex={stepIndex}
      steps={steps}
      type={joyrideType} />);
  }
}
