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

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
  }
  return t;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var prop_types_1 = require("prop-types");

var auto_complete_1 = require("antd/lib/auto-complete");

var input_1 = require("antd/lib/input");

var icon_1 = require("antd/lib/icon");
/**
 * Search搜索组件
 */


var Search =
/** @class */
function (_super) {
  __extends(Search, _super); // 把数据存入dataSource使组件可以通过ref拿到原始数据；


  function Search(props) {
    var _this = _super.call(this, props) || this;
    /**
     * @param {string} value-输入框的内容
     * @param {} params
     */


    _this.handleSearch = function (value, params) {
      params = params || _this.props.params;

      _this.getOptions(_this.props.getResolver(value, params));
    };

    _this.onChange = function (value) {
      _this.setState({
        value: value
      });

      _this.props.onChange();
    };

    _this.state = {
      dataSource: props.dataSource,
      select: {
        value: props.defaultValue,
        dataSource: props.options ? props.options : props.dataSource.map(function (item) {
          return React.createElement(auto_complete_1["default"].Option, {
            key: item[props.rowKey]
          }, _this.renderOption(item));
        })
      }
    };

    if (props.getResolver) {
      _this.getOptions(props.getResolver(null, _this.props.params), props.defaultValue);
    }

    return _this;
  }

  Search.prototype.find = function (condition) {
    return this.state.dataSource.find(condition);
  };

  Search.prototype.renderOption = function (item) {
    var _a = this.props,
        labelKey = _a.labelKey,
        renderItem = _a.renderItem;

    if (renderItem) {
      return renderItem(item);
    } else {
      return item[labelKey];
    }
  };

  Search.prototype.getOptions = function (resolver, value) {
    var _this = this;

    var rowKey = this.props.rowKey;
    return resolver.then(function (ret) {
      var nextState = {
        dataSource: ret.dataSource,
        select: _extends({}, ret, {
          dataSource: ret.dataSource.map(function (item) {
            return React.createElement(auto_complete_1["default"].Option, {
              key: item[rowKey]
            }, _this.renderOption(item));
          })
        })
      };

      if (value) {
        nextState.select.value = value;
      }

      _this.setState(nextState);
    });
  };

  Search.prototype.componentWillUnmount = function () {
    clearTimeout(this._timer);
  };

  Search.prototype.render = function () {
    var _this = this;

    var _a = this.props,

    /* eslint-disable no-unused-vars */
    params = _a.params,
        rowKey = _a.rowKey,
        labelKey = _a.labelKey,
        renderItem = _a.renderItem,
        dataSource = _a.dataSource,
        getResolver = _a.getResolver,
        defaultValue = _a.defaultValue,
        options = _a.options,
        _onSelect = _a.onSelect,
        input = _a.input,
        inputProps = _a.inputProps,
        restProps = __rest(_a, ["params", "rowKey", "labelKey", "renderItem", "dataSource", "getResolver", "defaultValue", "options", "onSelect", "input", "inputProps"]);

    var inputSearch = input || React.createElement(input_1["default"], _extends({}, inputProps, {
      suffix: React.createElement(icon_1["default"], {
        type: "search"
      })
    }));
    return React.createElement(auto_complete_1["default"], _extends({
      allowClear: true
    }, restProps, this.state.select, {
      filterOption: function filterOption(inputValue, option) {
        return inputValue === option.key || option.props.children.indexOf(inputValue) > -1;
      },
      onSearch: function onSearch(v) {
        clearTimeout(_this._timer);
        _this._timer = setTimeout(function () {
          _this.handleSearch(v);
        }, 150);
      },
      onSelect: function onSelect(v, o) {
        _onSelect && _onSelect(v, o);

        var select = _extends({}, _this.state.select, {
          value: v
        });

        _this.setState({
          select: select
        });
      }
    }), inputSearch);
  };

  Search.propTypes = {
    className: prop_types_1["default"].string,
    style: prop_types_1["default"].object,
    getResolver: prop_types_1["default"].func,
    defaultValue: prop_types_1["default"].string,
    dataSource: prop_types_1["default"].array,
    options: prop_types_1["default"].array,
    rowKey: prop_types_1["default"].string,
    labelKey: prop_types_1["default"].string,
    renderItem: prop_types_1["default"].func,
    onChange: prop_types_1["default"].func,
    onSelect: prop_types_1["default"].func,
    input: prop_types_1["default"].element,
    inputProps: prop_types_1["default"].object,
    params: prop_types_1["default"].object
  };
  Search.defaultProps = {
    rowKey: 'id',
    labelKey: 'value',
    dataSource: []
  };
  return Search;
}(react_1["default"].PureComponent);

exports.Search = Search;