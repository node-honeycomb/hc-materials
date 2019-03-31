import React from 'react';
import PropTypes from 'prop-types';
import AutoComplete from 'antd/lib/auto-complete';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';

/**
 * Search搜索组件
 */
export class Search extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,

    getResolver: PropTypes.func,
    defaultValue: PropTypes.string,
    dataSource: PropTypes.array,
    options: PropTypes.array,

    rowKey: PropTypes.string,
    labelKey: PropTypes.string,
    renderItem: PropTypes.func,

    onChange: PropTypes.func,
    onSelect: PropTypes.func,

    input: PropTypes.element,
    inputProps: PropTypes.object,
    params: PropTypes.object
  }

  static defaultProps = {
    rowKey: 'id',
    labelKey: 'value',
    dataSource: []
  }
  // 把数据存入dataSource使组件可以通过ref拿到原始数据；
  constructor(props) {
    super(props);
    this.state = {
      dataSource: props.dataSource,
      select: {
        value: props.defaultValue,
        dataSource: props.options ? props.options : props.dataSource.map(item => (<AutoComplete.Option key={item[props.rowKey]}>{this.renderOption(item)}</AutoComplete.Option>))
      }
    };
    if (props.getResolver) {
      this.getOptions(props.getResolver(null, this.props.params), props.defaultValue);
    }
  }

  find(condition) {
    return this.state.dataSource.find(condition);
  }

  renderOption(item) {
    const {labelKey, renderItem} = this.props;
    if (renderItem) {
      return renderItem(item);
    } else {
      return item[labelKey];
    }
  }

  getOptions(resolver, value) {
    const {rowKey} = this.props;
    return resolver.then(ret => {
      const nextState = {
        dataSource: ret.dataSource,
        select: Object.assign({}, ret, {
          dataSource: ret.dataSource.map(item => (<AutoComplete.Option key={item[rowKey]}>{this.renderOption(item)}</AutoComplete.Option>))
        })
      };
      if (value) {
        nextState.select.value = value;
      }
      this.setState(nextState);
    });
  }
  /**
   * @param {string} value-输入框的内容
   * @param {} params
   */
  handleSearch = (value, params) => {
    params = params || this.props.params;
    this.getOptions(this.props.getResolver(value, params));
  }


  componentWillUnmount() {
    clearTimeout(this._timer);
  }

  onChange = (value) => {
    this.setState({value});
    this
      .props
      .onChange();
  }

  render() {
    const {
      /* eslint-disable no-unused-vars */
      params, rowKey, labelKey, renderItem, dataSource, getResolver, defaultValue, options,
      onSelect, input, inputProps,
      ...restProps
    } = this.props;
    const inputSearch = input || (<Input {...inputProps} suffix={<Icon type="search" />} />);

    return (<AutoComplete
      allowClear={true}
      {...restProps}
      {...this.state.select}
      filterOption={(inputValue, option) => {
        return inputValue === option.key || option.props.children.indexOf(inputValue) > -1;
      }}
      onSearch={(v) => {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
          this.handleSearch(v);
        }, 150);
      }}
      onSelect={(v, o) => {
        onSelect && onSelect(v, o);
        const select = Object.assign({}, this.state.select, {value: v});
        this.setState({select: select});
      }}
    >{inputSearch}</AutoComplete>);
  }
}
