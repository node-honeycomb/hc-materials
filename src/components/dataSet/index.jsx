import React from 'react';
import PropTypes from 'prop-types';

export class DataSet extends React.PureComponent {
  static formatter = {};

  static propTypes = {
    Component: PropTypes.any,
    childProps: PropTypes.object,
    onChange: PropTypes.object,

    value: PropTypes.any,
    data: PropTypes.object,
    getResolver: PropTypes.func,
    defaultValue: PropTypes.string,
    format: PropTypes.string,
    formatter: PropTypes.func,
    children: PropTypes.any,
    loading: PropTypes.bool,
  }

  static defaultProps = {
    data: {},
    childProps: {}
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      loading: props.loading
    };
    this.stateUpdater = {};

    if (props.getResolver) {
      this._resolver = props.getResolver(props.defaultValue);
    }
    /**
     * prop = {
     *  value: Object | Function,
     *  format: String,
     *  formatter: Function,
     *  setter: String | Function
     * }
     */
    Object
      .keys(props.data)
      .forEach(name => {
        const prop = props.data[name];
        if (prop.value) {
          const originValue = typeof prop.value === 'function' ? prop.value.call(this, this.props) : prop.value;
          const formatter = this.getFormatter(props.formatter, name);
          // formatter是一系列解决组件schema的格式化函数
          if (formatter) {
            this.state[name] = formatter.call(this, prop.schema, originValue);
          } else {
            this.state[name] = originValue;
          }
        }
        if (prop.setter) {
          const setter = props.childProps[prop.setter];
          this.stateUpdater[prop.setter] = (updateFn) => (this.setState((prevState) => {
            let newValue = typeof updateFn === 'function' ?
              updateFn.call(this, prevState[name]) :
              updateFn;
            const formatter = this.getFormatter(props.formatter, name);
            if (formatter) {
              newValue = formatter.call(this, prop.schema, newValue);
            }
            setter && setter(newValue);
            return {[name]: newValue};
          }));
        }
      });
  }

  componentDidMount() {
    this.mounted = true;
    this._resolver && this._resolver.then(iState => {
      if (this.mounted) {
        iState.loading = false;
        this.setState(iState, this.props.onChange);
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleResolve = (value, params) => {
    if (this.props.loading) {
      this.setState({
        loading: true
      });
    }
    if (this.props.getResolver) {
      const resolver = this.props.getResolver(value, params);
      resolver.then(iState => {
        if (this.mounted) {
          iState.loading = false;
          this.setState(iState, this.props.onChange);
        }
      });
    }
  }

  getFormatter(formatter, name) {
    if (!formatter && DataSet.formatter) {
      const comFormatter = DataSet.formatter[this.props.format] || {};
      formatter = comFormatter[name];
    }
    return formatter;
  }

  getRealInstance() {
    return this._instance;
  }

  render() {
    const {children, Component, childProps} = this.props;
    if (Component) {
      if (children) {
        return (
          <Component
            ref={instance => this._instance = instance}
            {...childProps}
            {...this.state}
            {...this.stateUpdater}>{children}</Component>
        );
      } else {
        return (<Component
          ref={instance => this._instance = instance}
          {...childProps}
          {...this.state}
          {...this.stateUpdater} />);
      }
    } else {
      return React.cloneElement(React.Children.only(children), {
        ref: instance => {
          this._instance = instance;
          if (typeof children.ref === 'function') {
            children.ref(instance);
          }
        },
        ...childProps,
        ...this.state,
        ...this.stateUpdater
      });
    }
  }
}
