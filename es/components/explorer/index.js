function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from '../navLink';
import { Input, Tree, Radio, Icon, Alert, Spin } from 'antd';
export var Explorer =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(Explorer, _React$PureComponent);

  function Explorer(props, context) {
    var _this;

    _classCallCheck(this, Explorer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Explorer).call(this, props, context));
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

  _createClass(Explorer, [{
    key: "handleChange",
    value: function handleChange(dataSource, changeNodes, map) {
      var _this2 = this;

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
            item.children = _this2.handleChange(item.children, changeNodes, map);
          }
        } else {
          changeNodes.splice(map[item.id], 1);
          newDataSource.push(item);
        }
      });
      return newDataSource;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.dataSource !== prevProps.dataSource || this.props.changeNodes !== prevProps.changeNodes) {
        this.setState({
          dataSource: this.handleChange(this.props.dataSource, this.props.changeNodes)
        });
      }
    }
  }, {
    key: "getExpandedKeys",
    value: function getExpandedKeys(dataSource, matcher, parentKey) {
      var _this3 = this;

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
          var keys = _this3.getExpandedKeys(item.children, matcher, item.id);

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
    }
  }, {
    key: "getIcon",
    value: function getIcon(item) {
      var icon = item.icon ? React.createElement(Icon, {
        type: item.icon
      }) : null;

      if (this.props.leafIcon) {
        return icon || (item.children ? null : React.createElement(Icon, {
          type: this.props.leafIcon
        }));
      } else {
        return icon;
      }
    }
  }, {
    key: "getTitle",
    value: function getTitle(item) {
      return this.props.getTitle(item.title || item.name, item);
    }
  }, {
    key: "loopTreeNode",
    value: function loopTreeNode(dataSource) {
      var _this4 = this;

      var searchValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var links = this.props.links;
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

        var label = _this4.getTitle(item);

        if (searchValue) {
          index = label.indexOf(searchValue);
          beforeStr = label.substr(0, index);
          afterStr = label.substr(index + searchValue.length);
        }

        var btns = null;

        if (links && (_this4.props.byLeaf && !item.children || !_this4.props.byLeaf)) {
          btns = React.createElement("div", {
            className: "hc-explorer_elem-btns"
          }, React.createElement(NavLink, {
            links: links,
            data: item
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
              return _this4.handleSelect(item);
            }
          }, _this4.getIcon(item), beforeStr, React.createElement("span", {
            style: {
              color: '#f50'
            }
          }, searchValue), afterStr));
        } else {
          title = React.createElement("span", {
            id: item.id
          }, btns, React.createElement("span", {
            onClick: function onClick() {
              return _this4.handleSelect(item);
            }
          }, _this4.getIcon(item), label));
        }

        if (item.children && item.children.length) {
          return React.createElement(Tree.TreeNode, {
            key: item.id,
            title: title,
            className: activeKey === item.id ? 'active' : ''
          }, _this4.loopTreeNode(item.children, searchValue));
        } else {
          return React.createElement(Tree.TreeNode, {
            key: item.id,
            title: title,
            className: activeKey === item.id ? 'active hc-explorer-leaf' : ' hc-explorer-leaf'
          });
        }
      });

      if (firstMatchId && this._lazySearch) {
        this._lazySearch(firstMatchId);

        this._lazySearch = null;
      }

      return nodes;
    }
  }, {
    key: "handleSelect",
    value: function handleSelect(node) {
      this.props.onSelect && this.props.onSelect(node);
      this.setState({
        expandedKeys: this.getExpandedKeys(this.getData(), function (item) {
          return node.id === item.id;
        }),
        activeKey: node.id
      });
    }
  }, {
    key: "getData",
    value: function getData() {
      if (this.props.mode === 'multiple') {
        return this.state.dataSource[this.state.activeTab || 0];
      } else {
        return this.state.dataSource;
      }
    }
  }, {
    key: "renderTabs",
    value: function renderTabs(dataSource) {
      var _this5 = this;

      var activeTab = this.state.activeTab;
      return React.createElement("div", {
        className: "hc-explorer-elem_btn-group"
      }, React.createElement(Radio.Group, {
        value: activeTab,
        onChange: function onChange(e) {
          _this5.setState({
            searchValue: '',
            expandedKeys: [],
            activeTab: e.target.value
          });

          _this5.props.onChange && _this5.props.onChange(e.target.value);
        }
      }, dataSource.map(function (item) {
        return React.createElement(Radio.Button, {
          value: item.id,
          key: item.id
        }, item.name);
      })));
    }
  }, {
    key: "renderSearch",
    value: function renderSearch(dataSource) {
      var _this6 = this;

      var searchProps = {
        size: 'small',
        value: this.state.searchValue,
        placeholder: this.props.searchPlaceholder,
        onChange: function onChange(e) {
          var value = e.target.value;

          _this6.setState({
            searchValue: value
          });

          _this6.props.onSearch && _this6.props.onSearch(value);
          clearTimeout(_this6._timer);
          _this6._timer = setTimeout(function () {
            var expandedKeys = _this6.getExpandedKeys(dataSource, function (item) {
              return item.name.indexOf(value) > -1;
            });

            _this6.setState({
              expandedKeys: expandedKeys
            }, function () {
              _this6._lazySearch = function (firstMatchId) {
                _this6._timer = setTimeout(function () {
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
      }, React.createElement(Input.Search, searchProps));
    }
  }, {
    key: "render",
    value: function render() {
      var _this7 = this;

      var _this$props = this.props,
          menu = _this$props.menu,
          noSearch = _this$props.noSearch,
          title = _this$props.title,
          mode = _this$props.mode;
      var _this$state = this.state,
          searchValue = _this$state.searchValue,
          activeKey = _this$state.activeKey,
          expandedKeys = _this$state.expandedKeys;
      var dataSource = this.getData();
      var treeProps = {
        checkStrictly: true,
        expandedKeys: expandedKeys,
        autoExpandParent: searchValue !== undefined,
        onExpand: function onExpand(expandedKeys) {
          _this7.setState({
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
      }, dataSource.length ? React.createElement(Tree, treeProps, this.loopTreeNode(dataSource, searchValue)) : React.createElement(Spin, {
        spinning: this.props.pending
      }, React.createElement(Alert, {
        style: {
          margin: '0 6px'
        },
        message: this.props.pending ? 'Loading...' : this.props.noResult,
        type: "warning"
      })))));
    }
  }]);

  return Explorer;
}(React.PureComponent);
Explorer.propTypes = {
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
  links: PropTypes.array,
  onSearch: PropTypes.func,
  noResult: PropTypes.string,
  pending: PropTypes.bool,
  showLine: PropTypes.bool,
  leafIcon: PropTypes.string,
  byLeaf: PropTypes.bool,
  getTitle: PropTypes.func
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
  pending: false,
  getTitle: function getTitle(title) {
    return title;
  }
};