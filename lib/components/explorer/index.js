"use strict";

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

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var prop_types_1 = require("prop-types");

var input_1 = require("antd/lib/input");

var tree_1 = require("antd/lib/tree");

var radio_1 = require("antd/lib/radio");

var icon_1 = require("antd/lib/icon");

var alert_1 = require("antd/lib/alert");

var spin_1 = require("antd/lib/spin");

var Explorer =
/** @class */
function (_super) {
  __extends(Explorer, _super);

  function Explorer(props, context) {
    var _this = _super.call(this, props, context) || this;

    _this.state = {
      searchValue: '',
      expandedKeys: [],
      activeTab: props.cateId,
      activeKey: props.value,
      dataSource: props.changeNodes ? _this.handleChange(props.dataSource, props.changeNodes) : props.dataSource
    };

    if (props.value) {
      _this.state.expandedKeys = _this.getExpandedKeys(_this.getData(), function (item) {
        return item.id === props.value;
      });
    }

    _this._lazySearch = null;
    return _this;
  }

  Explorer.prototype.handleChange = function (dataSource, changeNodes, map) {
    var _this = this;

    if (!changeNodes.length) return dataSource;

    if (!map) {
      map = {};
      changeNodes.forEach(function (node, index) {
        map[node.id] = index;
      });
    }

    var newDataSource = [];
    dataSource.forEach(function (item) {
      if (map[item.id] === undefined) {
        if (item.children) {
          item.children = _this.handleChange(item.children, changeNodes, map);
        }
      } else {
        changeNodes.splice(map[item.id], 1);
        newDataSource.push(item);
      }
    });
    return newDataSource;
  };

  Explorer.prototype.componentDidUpdate = function (prevProps) {
    if (this.props.dataSource !== prevProps.dataSource || this.props.changeNodes !== prevProps.changeNodes) {
      this.setState({
        dataSource: this.handleChange(this.props.dataSource, this.props.changeNodes)
      });
    }
  };

  Explorer.prototype.getExpandedKeys = function (dataSource, matcher, parentKey) {
    var _this = this;

    var expandedKeys = [];
    dataSource.forEach(function (item) {
      if (matcher(item)) {
        // 因为有子集有命中的，所以父级ID要加进去
        if (parentKey) {
          expandedKeys.push(String(parentKey));
          parentKey = null;
        }

        expandedKeys.push(String(item.id));
      } else if (item.children && item.children.length) {
        var keys = _this.getExpandedKeys(item.children, matcher, item.id);

        var len = keys.length;

        if (len) {
          if (item.id !== keys[len - 1]) {
            expandedKeys.push(String(item.id));
          }

          for (var i = 0; i < len; i++) {
            expandedKeys.push(String(keys[i]));
          }
        }
      }
    });
    return expandedKeys;
  };

  Explorer.prototype.getIcon = function (item) {
    var icon = item.icon ? React.createElement(icon_1["default"], {
      type: item.icon
    }) : null;

    if (this.props.leafIcon) {
      return icon || (item.children ? null : React.createElement(icon_1["default"], {
        type: this.props.leafIcon
      }));
    } else {
      return icon;
    }
  };

  Explorer.prototype.loopTreeNode = function (dataSource, searchValue) {
    var _this = this;

    if (searchValue === void 0) {
      searchValue = '';
    }

    var actions = this.props.actions;
    var activeKey = this.state.activeKey;
    var firstMatchId;
    /**
     * item = {
     *  id,
     *  name,
     *  icon,
     *  children
     * }
     */

    var nodes = dataSource.map(function (item) {
      var index = -1;
      var beforeStr;
      var afterStr;
      var title;
      var label = item.name;

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


      var btns = null;

      if (actions && (_this.props.byLeaf && !item.children || !_this.props.byLeaf)) {
        btns = React.createElement("span", {
          className: "hc-explorer_elem-btns"
        }, actions.map(function (btnItem, key) {
          return React.createElement("a", {
            key: key,
            href: "javascript:;",
            onClick: function onClick() {
              btnItem.onAction && btnItem.onAction(item);
            },
            title: btnItem.title || btnItem.text
          }, btnItem.icon ? React.createElement(icon_1["default"], {
            type: btnItem.icon
          }) : btnItem.text);
        }));
      }

      if (index > -1) {
        if (!firstMatchId) {
          firstMatchId = item.id;
        }

        title = React.createElement("span", {
          id: item.id,
          className: "hc-explorer-elem_span"
        }, btns, React.createElement("span", {
          onClick: function onClick() {
            return _this.handleSelect(item);
          }
        }, _this.getIcon(item), beforeStr, React.createElement("span", {
          style: {
            color: '#f50'
          }
        }, searchValue), afterStr));
      } else {
        title = React.createElement("span", {
          id: item.id
        }, btns, React.createElement("span", {
          onClick: function onClick() {
            return _this.handleSelect(item);
          }
        }, _this.getIcon(item), label));
      }

      if (item.children && item.children.length) {
        return React.createElement(tree_1["default"].TreeNode, {
          key: item.id,
          title: title,
          className: activeKey === item.id ? 'active' : ''
        }, _this.loopTreeNode(item.children, searchValue));
      } else {
        return React.createElement(tree_1["default"].TreeNode, {
          key: item.id,
          title: title,
          className: activeKey === item.id ? 'active' : ''
        });
      }
    });

    if (firstMatchId && this._lazySearch) {
      this._lazySearch(firstMatchId);

      this._lazySearch = null;
    }

    return nodes;
  };

  Explorer.prototype.handleSelect = function (node) {
    this.props.onSelect && this.props.onSelect(node);
    this.setState({
      expandedKeys: this.getExpandedKeys(this.getData(), function (item) {
        return node.id === item.id;
      }),
      activeKey: node.id
    });
  };

  Explorer.prototype.getData = function () {
    if (this.props.mode === 'multiple') {
      return this.state.dataSource[this.state.activeTab || 0];
    } else {
      return this.state.dataSource;
    }
  };

  Explorer.prototype.renderTabs = function (dataSource) {
    var _this = this;

    var activeTab = this.state.activeTab;
    return React.createElement("div", {
      className: "hc-explorer-elem_btn-group"
    }, React.createElement(radio_1["default"].Group, {
      value: activeTab,
      onChange: function onChange(e) {
        _this.setState({
          searchValue: '',
          expandedKeys: [],
          activeTab: e.target.value
        });

        _this.props.onChange && _this.props.onChange(e.target.value);
      }
    }, dataSource.map(function (item) {
      return React.createElement(radio_1["default"].Button, {
        value: item.id,
        key: item.id
      }, item.name);
    })));
  };

  Explorer.prototype.renderSearch = function (dataSource) {
    var _this = this;

    var searchProps = {
      size: 'small',
      value: this.state.searchValue,
      placeholder: this.props.searchPlaceholder,
      onChange: function onChange(e) {
        var value = e.target.value;

        _this.setState({
          searchValue: value
        });

        _this.props.onSearch && _this.props.onSearch(value);
        clearTimeout(_this._timer);
        _this._timer = setTimeout(function () {
          var expandedKeys = _this.getExpandedKeys(dataSource, function (item) {
            return item.name.indexOf(value) > -1;
          });

          _this.setState({
            expandedKeys: expandedKeys
          }, function () {
            _this._lazySearch = function (firstMatchId) {
              _this._timer = setTimeout(function () {
                var node = document.getElementById(firstMatchId).parentNode.parentNode.parentNode;
                node.scrollIntoView();
              }, 200);
            };
          });
        }, 200);
      }
    };
    return React.createElement("div", {
      className: "hc-explorer-elem_search"
    }, React.createElement(input_1["default"].Search, searchProps));
  };

  Explorer.prototype.render = function () {
    var _this = this;

    var _a = this.props,
        menu = _a.menu,
        noSearch = _a.noSearch,
        title = _a.title,
        mode = _a.mode;
    var _b = this.state,
        searchValue = _b.searchValue,
        activeKey = _b.activeKey,
        expandedKeys = _b.expandedKeys;
    var dataSource = this.getData();
    var treeProps = {
      checkStrictly: true,
      expandedKeys: expandedKeys,
      autoExpandParent: searchValue !== undefined,
      onExpand: function onExpand(expandedKeys) {
        _this.setState({
          expandedKeys: expandedKeys,
          searchValue: ''
        });
      },
      multiple: false,
      selectable: false,
      selectedKeys: activeKey ? [String(activeKey)] : [],
      showLine: this.props.showLine
    };
    return React.createElement("div", {
      className: "hc-explorer"
    }, React.createElement("div", {
      className: "hc-explorer_wrapper"
    }, title ? React.createElement("div", {
      className: "hc-explorer_title"
    }, React.createElement("span", {
      className: "hc-explorer_link"
    }, title), menu) : null, mode === 'multiple' ? this.renderTabs(dataSource) : null, noSearch ? null : this.renderSearch(dataSource), React.createElement("div", {
      className: "hc-explorer_tree"
    }, dataSource.length ? React.createElement(tree_1["default"], treeProps, this.loopTreeNode(dataSource, searchValue)) : React.createElement(spin_1["default"], {
      spinning: this.props.pending
    }, React.createElement(alert_1["default"], {
      style: {
        margin: '0 6px'
      },
      message: this.props.pending ? 'Loading...' : this.props.noResult,
      type: "warning"
    })))));
  };

  Explorer.propTypes = {
    mode: prop_types_1["default"].string,
    dataSource: prop_types_1["default"].array,
    changeNodes: prop_types_1["default"].array,
    noSearch: prop_types_1["default"].bool,
    cateId: prop_types_1["default"].any,
    value: prop_types_1["default"].any,
    onSelect: prop_types_1["default"].func,
    onChange: prop_types_1["default"].func,
    searchPlaceholder: prop_types_1["default"].string,
    menu: prop_types_1["default"].element,
    title: prop_types_1["default"].string,
    actions: prop_types_1["default"].array,
    onSearch: prop_types_1["default"].func,
    noResult: prop_types_1["default"].string,
    pending: prop_types_1["default"].bool,
    showLine: prop_types_1["default"].bool,
    leafIcon: prop_types_1["default"].string,
    byLeaf: prop_types_1["default"].bool
  };
  /**
   * dataSource = [
   *  {
   *    id,
   *    children
   *  },
   *  ...
   * ]
   */

  Explorer.defaultProps = {
    dataSource: [],
    changeNodes: [],
    // single, multiple
    mode: 'single',
    noResult: 'No Result!',
    pending: false
  };
  return Explorer;
}(react_1["default"].PureComponent);

exports.Explorer = Explorer;