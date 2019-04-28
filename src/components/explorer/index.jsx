import React from 'react';
import PropTypes from 'prop-types';

import {Input, Tree, Radio, Icon, Alert, Spin} from 'antd';

export class Explorer extends React.PureComponent {
  static propTypes = {
    mode: PropTypes.string,
    dataSource: PropTypes.array,
    changeNodes: PropTypes.array,
    noSearch: PropTypes.bool,
    cateId: PropTypes.any,
    value: PropTypes.any,
    onSelect: PropTypes.func,
    onChange: PropTypes.func,
    searchPlaceholder: PropTypes.string,
    menu: PropTypes.element,
    title: PropTypes.string,
    actions: PropTypes.array,
    onSearch: PropTypes.func,
    noResult: PropTypes.string,
    pending: PropTypes.bool,
    showLine: PropTypes.bool,
    leafIcon: PropTypes.string,
    byLeaf: PropTypes.bool
  }

  /**
   * dataSource = [
   *  {
   *    id,
   *    children
   *  },
   *  ...
   * ]
   */
  static defaultProps = {
    dataSource: [],
    changeNodes: [],
    // single, multiple
    mode: 'single',
    noResult: 'No Result!',
    pending: false
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      searchValue: '',
      expandedKeys: [],
      activeTab: props.cateId,
      activeKey: props.value,
      dataSource: props.changeNodes ? this.handleChange(props.dataSource, props.changeNodes) : props.dataSource
    };
    if (props.value) {
      this.state.expandedKeys = this.getExpandedKeys(this.getData(), item => item.id === props.value);
    }

    this._lazySearch = null;
  }

  handleChange(dataSource, changeNodes, map) {
    if (!changeNodes.length) return dataSource;

    if (!map) {
      map = {};
      changeNodes.forEach((node, index) => {
        map[node.id] = index;
      });
    }

    const newDataSource = [];
    dataSource.forEach(item => {
      if (map[item.id] === undefined) {
        if (item.children) {
          item.children = this.handleChange(item.children, changeNodes, map);
        }
      } else {
        changeNodes.splice(map[item.id], 1);
        newDataSource.push(item);
      }
    });
    return newDataSource;
  }

  componentDidUpdate(prevProps) {
    if (this.props.dataSource !== prevProps.dataSource || this.props.changeNodes !== prevProps.changeNodes) {
      this.setState({dataSource: this.handleChange(this.props.dataSource, this.props.changeNodes)});
    }
  }

  getExpandedKeys(dataSource, matcher, parentKey) {
    const expandedKeys = [];
    dataSource.forEach(item => {
      if (matcher(item)) {
        // 因为有子集有命中的，所以父级ID要加进去
        if (parentKey) {
          expandedKeys.push(String(parentKey));
          parentKey = null;
        }
        expandedKeys.push(String(item.id));
      } else if (item.children && item.children.length) {
        const keys = this.getExpandedKeys(item.children, matcher, item.id);
        const len = keys.length;
        if (len) {
          if (item.id !== keys[len - 1]) {
            expandedKeys.push(String(item.id));
          }
          for (let i = 0; i < len; i++) {
            expandedKeys.push(String(keys[i]));
          }
        }
      }
    });
    return expandedKeys;
  }

  getIcon(item) {
    const icon = item.icon ? (<Icon type={item.icon} />) : null;
    if (this.props.leafIcon) {
      return icon || (item.children ? null : (<Icon type={this.props.leafIcon} />));
    } else {
      return icon;
    }
  }

  loopTreeNode(dataSource, searchValue = '') {
    const actions = this.props.actions;
    const activeKey = this.state.activeKey;
    let firstMatchId;
    /**
     * item = {
     *  id,
     *  name,
     *  icon,
     *  children
     * }
     */
    const nodes = dataSource.map((item) => {
      let index = -1;
      let beforeStr;
      let afterStr;
      let title;
      let label = item.name;
      if (item.title) {
        label = item.title;
      } else if (searchValue) {
        index = label.indexOf(searchValue);
        beforeStr = label.substr(0, index);
        afterStr = label.substr(index + searchValue.length);
      }
      /**
       * actions = [{
       *  icon,
       *  title,
       *  text,
       *  onAction
       * }, ...]
       */
      let btns = null;
      if (actions && (this.props.byLeaf && !item.children || !this.props.byLeaf)) {
        btns = (<span className="hc-explorer_elem-btns">{
          actions.map((btnItem, key) => {
            return (<a
              key={key}
              href="javascript:;"
              onClick={() => {
                btnItem.onAction && btnItem.onAction(item);
              }}
              title={btnItem.title || btnItem.text}
            >{btnItem.icon ? (<Icon type={btnItem.icon} />) : (btnItem.text)}</a>);
          })}</span>);
      }

      if (index > -1) {
        if (!firstMatchId) {
          firstMatchId = item.id;
        }
        title = (
          <span id={item.id} className="hc-explorer-elem_span">
            {btns}
            <span onClick={() => this.handleSelect(item)}>
              {this.getIcon(item)}
              {beforeStr}
              <span style={{color: '#f50'}}>{searchValue}</span>
              {afterStr}
            </span>
          </span>
        );
      } else {
        title = (<span id={item.id}>
          {btns}
          <span onClick={() => this.handleSelect(item)}>{this.getIcon(item)}{label}</span>
        </span>);
      }
      if (item.children && item.children.length) {
        return (
          <Tree.TreeNode key={item.id} title={title} className={activeKey === item.id ? 'active' : ''}>
            {this.loopTreeNode(item.children, searchValue)}
          </Tree.TreeNode>
        );
      } else {
        return <Tree.TreeNode key={item.id} title={title} className={activeKey === item.id ? 'active' : ''} />;
      }
    });
    if (firstMatchId && this._lazySearch) {
      this._lazySearch(firstMatchId);
      this._lazySearch = null;
    }
    return nodes;
  }

  handleSelect(node) {
    this.props.onSelect && this.props.onSelect(node);
    this.setState({
      expandedKeys: this.getExpandedKeys(this.getData(), item => node.id === item.id),
      activeKey: node.id
    });
  }

  getData() {
    if (this.props.mode === 'multiple') {
      return this.state.dataSource[this.state.activeTab || 0];
    } else {
      return this.state.dataSource;
    }
  }

  renderTabs(dataSource) {
    const {activeTab} = this.state;
    return (<div className="hc-explorer-elem_btn-group">
      <Radio.Group value={activeTab} onChange={e => {
        this.setState({
          searchValue: '',
          expandedKeys: [],
          activeTab: e.target.value
        });
        this.props.onChange && this.props.onChange(e.target.value);
      }}>
        {dataSource.map(item => {
          return (<Radio.Button value={item.id} key={item.id}>{item.name}</Radio.Button>);
        })}
      </Radio.Group>
    </div>);
  }

  renderSearch(dataSource) {
    const searchProps = {
      size: 'small',
      value: this.state.searchValue,
      placeholder: this.props.searchPlaceholder,
      onChange: (e) => {
        const value = e.target.value;
        this.setState({
          searchValue: value
        });
        this.props.onSearch && this.props.onSearch(value);

        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
          const expandedKeys = this.getExpandedKeys(dataSource, item => item.name.indexOf(value) > -1);
          this.setState({
            expandedKeys: expandedKeys
          }, () => {
            this._lazySearch = (firstMatchId) => {
              this._timer = setTimeout(() => {
                const node = document.getElementById(firstMatchId).parentNode.parentNode.parentNode;
                node.scrollIntoView();
              }, 200);
            };
          });
        }, 200);
      }
    };
    return (<div className="hc-explorer-elem_search"><Input.Search {...searchProps} /></div>);
  }

  render() {
    const {menu, noSearch, title, mode} = this.props;
    const {searchValue, activeKey, expandedKeys} = this.state;
    const dataSource = this.getData();

    const treeProps = {
      checkStrictly: true,
      expandedKeys: expandedKeys,
      autoExpandParent: searchValue !== undefined,
      onExpand: (expandedKeys) => {
        this.setState({
          expandedKeys: expandedKeys,
          searchValue: ''
        });
      },
      multiple: false,
      selectable: false,
      selectedKeys: activeKey ? [String(activeKey)] : [],
      showLine: this.props.showLine
    };
    return (<div className="hc-explorer">
      <div  className="hc-explorer_wrapper">
        {title ? (<div className="hc-explorer_title">
          <span className="hc-explorer_link">{title}</span>
          {menu}
        </div>) : null}
        {mode === 'multiple' ? this.renderTabs(dataSource) : null}
        {noSearch ? null : this.renderSearch(dataSource)}
        <div className="hc-explorer_tree">
          {dataSource.length ? (<Tree {...treeProps}>
            {this.loopTreeNode(dataSource, searchValue)}
          </Tree>) : (<Spin spinning={this.props.pending}><Alert style={{margin: '0 6px'}} message={this.props.pending ? 'Loading...' : this.props.noResult} type="warning" /></Spin>)}
        </div>
      </div>
    </div>);
  }
}
