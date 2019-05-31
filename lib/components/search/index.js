"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Search = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _antd = require("antd");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

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

/**
 * Search搜索组件
 */
var Search =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(Search, _React$PureComponent);

  // 把数据存入dataSource使组件可以通过ref拿到原始数据；
  function Search(props) {
    var _this;

    _classCallCheck(this, Search);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Search).call(this, props));
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
          return _react["default"].createElement(_antd.AutoComplete.Option, {
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

  _createClass(Search, [{
    key: "find",
    value: function find(condition) {
      return this.state.dataSource.find(condition);
    }
  }, {
    key: "renderOption",
    value: function renderOption(item) {
      var _this$props = this.props,
          labelKey = _this$props.labelKey,
          renderItem = _this$props.renderItem;

      if (renderItem) {
        return renderItem(item);
      } else {
        return item[labelKey];
      }
    }
  }, {
    key: "getOptions",
    value: function getOptions(resolver, value) {
      var _this2 = this;

      var rowKey = this.props.rowKey;
      return resolver.then(function (ret) {
        var nextState = {
          dataSource: ret.dataSource,
          select: _extends({}, ret, {
            dataSource: ret.dataSource.map(function (item) {
              return _react["default"].createElement(_antd.AutoComplete.Option, {
                key: item[rowKey]
              }, _this2.renderOption(item));
            })
          })
        };

        if (value) {
          nextState.select.value = value;
        }

        _this2.setState(nextState);
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearTimeout(this._timer);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _a = this.props,
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

      var inputSearch = input || _react["default"].createElement(_antd.Input, _extends({}, inputProps, {
        suffix: _react["default"].createElement(_antd.Icon, {
          type: "search"
        })
      }));

      return _react["default"].createElement(_antd.AutoComplete, _extends({
        className: "hc-search",
        allowClear: true
      }, restProps, this.state.select, {
        filterOption: function filterOption(inputValue, option) {
          return inputValue === option.key || option.props.children.indexOf(inputValue) > -1;
        },
        onSearch: function onSearch(v) {
          clearTimeout(_this3._timer);
          _this3._timer = setTimeout(function () {
            _this3.handleSearch(v);
          }, 150);
        },
        onSelect: function onSelect(v, o) {
          _onSelect && _onSelect(v, o);

          var select = _extends({}, _this3.state.select, {
            value: v
          });

          _this3.setState({
            select: select
          });
        }
      }), inputSearch);
    }
  }]);

  return Search;
}(_react["default"].PureComponent);

exports.Search = Search;
Search.propTypes = {
  className: _propTypes["default"].string,
  style: _propTypes["default"].object,
  getResolver: _propTypes["default"].func,
  defaultValue: _propTypes["default"].string,
  dataSource: _propTypes["default"].array,
  options: _propTypes["default"].array,
  rowKey: _propTypes["default"].string,
  labelKey: _propTypes["default"].string,
  renderItem: _propTypes["default"].func,
  onChange: _propTypes["default"].func,
  onSelect: _propTypes["default"].func,
  input: _propTypes["default"].element,
  inputProps: _propTypes["default"].object,
  params: _propTypes["default"].object
};
Search.defaultProps = {
  rowKey: 'id',
  labelKey: 'value',
  dataSource: []
};