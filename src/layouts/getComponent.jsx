import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

export function getComponent(option, getProps) {
  if (option === false) {
    return () => EmptyComponent;
  } else if (!option && !getProps) {
    return (BaseComponent) => BaseComponent;
  }
  let AppointComponent;
  let propValues = {};
  if (option && option.prototype  && option.prototype.isReactComponent) {
    AppointComponent = option;
  } else {
    propValues = option || {};
  }

  const decorator = BaseComponent => {
    AppointComponent = AppointComponent || BaseComponent || EmptyComponent;
    class Component extends React.PureComponent {
      constructor(props) {
        super(props);
        if (BaseComponent && !BaseComponent.prototype.isReactComponent) {
          this.state = {
            stateProps: {},
            Component: EmptyComponent
          };
          this._getComponent = BaseComponent;
        } else {
          this.state = {
            stateProps: {},
            Component: AppointComponent
          };
        }
      }
      componentDidMount() {
        this.mounted = true;
        if (this._getComponent) {
          this._getComponent(this.context, (err, component, props) => {
            if (err) {
              window.console.error(err);
            } else {
              if (this.mounted) {
                this.setState({
                  stateProps: props || {},
                  Component: component
                });
              }
            }
          }, (nextState) => this.setState({stateProps: Object.assign({}, this.state.stateProps, nextState)}));
        }
      }

      componentWillUnmount() {
        this.mounted = false;
      }

      getRealInstance() {
        return this._wrappedComponent;
      }
      render() {
        const {stateProps, Component} = this.state;
        const newProps = Object.assign({}, propValues);
        for (let key in this.props) {
          if (newProps[key] === undefined) {
            newProps[key] = this.props[key];
          }
        }
        const asyncProps = getProps ? getProps(newProps, this.context, (nextProps) => {
          this.setState({
            stateProps: Object.assign({}, this.state.stateProps, nextProps)
          });
        }) : {};
        return (<Component ref={inst => this._wrappedComponent = inst} {...newProps} {...asyncProps} {...stateProps} />);
      }
    }
    const newComponent = hoistNonReactStatics(Component, AppointComponent);
    if (BaseComponent && BaseComponent.contextTypes) {
      newComponent.contextTypes = Object.assign(newComponent.contextTypes || {}, BaseComponent.contextTypes);
    }
    return newComponent;
  };
  return decorator;
}

/* eslint-disable react/prop-types */
function EmptyComponent(props) {
  return (<span id={props.id}>{props.children}</span>);
}
getComponent.emptyComponent = EmptyComponent;

