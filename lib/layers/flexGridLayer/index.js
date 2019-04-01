"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FlexGridLayer = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactGridLayout = _interopRequireDefault(require("react-grid-layout"));

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

var FlexGridLayer =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(FlexGridLayer, _React$PureComponent);

  function FlexGridLayer() {
    var _this;

    _classCallCheck(this, FlexGridLayer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FlexGridLayer).apply(this, arguments));
    _this.state = {
      width: 800
    };
    _this._nextVectors = [];
    return _this;
  }

  _createClass(FlexGridLayer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      /* eslint-disable react/no-find-dom-node */
      var dom = _reactDom["default"].findDOMNode(this);

      this.setState({
        width: dom.offsetWidth
      }, function () {
        if (_this2.context.resizer) {
          _this2._cancelResize = _this2.context.resizer.resize(dom, function () {
            _this2.setState({
              width: dom.offsetWidth
            });
          });
        }
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._cancelResize && this._cancelResize();
    }
  }, {
    key: "getGridVector",
    value: function getGridVector(vectors) {
      if (this._nextVectors.length) {
        return this._nextVectors.shift();
      }

      var precedent = !!vectors[0]; // 一行分6个

      var count = 12; // 所有高度

      var hArr = new Array(count); // x轴只判断一遍

      var xArr = []; // 最低高度

      var minHeight = precedent ? count : 0; // 最低高度的下标

      var minHkey = 0;
      var tmpHeight;

      for (var i = vectors.length; i--;) {
        tmpHeight = vectors[i].y + vectors[i].h;

        if (tmpHeight <= minHeight && !xArr[vectors[i].x]) {
          minHeight = tmpHeight;
          minHkey = i;
          xArr[vectors[i].x] = true;
        } // 首行占用了多少位置


        if (vectors[i].y === 0) {
          for (var j = 0; j < vectors[i].w; j++) {
            hArr[vectors[i].x + j] = true;
          }
        }
      }

      var minH = 3;
      var minW = 4;
      var k = 0; // 已占有2个宽度为准

      var fWidth = 0; // 有占用时的下标

      var fWkey = 0;

      if (hArr.length) {
        while (fWkey < count) {
          if (hArr[fWkey]) {
            fWkey++;
          } else {
            while (k < minW) {
              if (fWkey + k < count && !hArr[fWkey + k]) {
                fWidth++;
              }

              k++;
            }

            break;
          }
        }
      } // 未占满


      var vector;

      if (fWidth === minW) {
        vector = {
          x: fWkey,
          y: 0,
          w: fWidth,
          h: minH
        };
      } else if (precedent) {
        // 重要，如果一个模块下，可以容纳2个，那么就加入2个
        var mults = Math.floor(vectors[minHkey].w / minW);

        if (mults > 1) {
          vector = {
            x: vectors[minHkey].x,
            y: minHeight,
            w: minW,
            h: minH
          };

          for (var z = 1; z < mults; z++) {
            this._nextVectors.push({
              x: vectors[minHkey].x + minW * z,
              y: minHeight,
              w: minW * z,
              h: minH
            });
          }
        } else {
          vector = {
            x: vectors[minHkey].x,
            y: minHeight,
            w: vectors[minHkey].w,
            h: minH
          };
        }
      } else {
        vector = {
          x: 0,
          y: 0,
          w: minW,
          h: minH
        };
      }

      return vector;
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props = this.props,
          components = _this$props.components,
          LayerItem = _this$props.LayerItem,
          onLayerChange = _this$props.onLayerChange,
          autoGrid = _this$props.autoGrid,
          isResizable = _this$props.isResizable,
          style = _this$props.style;
      var editable = this.context.layer.isEditable();
      var enabled = isResizable || editable;
      var vectors = [];
      return _react["default"].createElement("div", {
        style: _extends({
          position: 'relative'
        }, style),
        className: "hc-layer hc-layer-flexGrid"
      }, _react["default"].createElement(_reactGridLayout["default"], {
        isDraggable: enabled,
        isResizable: enabled,
        cols: 12,
        rowHeight: 100,
        width: this.state.width
      }, components.map(function (item, index) {
        var vector = item.attrs.vector;

        if (autoGrid) {
          if (!vector) {
            vector = item.attrs.vector = _this3.getGridVector(vectors);
          }

          vectors.push(vector);
        }

        return _react["default"].createElement("div", {
          key: item.key || index,
          "data-tt": 1,
          "data-grid": vector
        }, _react["default"].createElement(LayerItem, _extends({
          onChange: onLayerChange
        }, item.attrs), item && item.component ? _react["default"].createElement(item.component, null) : null));
      })));
    }
  }]);

  return FlexGridLayer;
}(_react["default"].PureComponent);

exports.FlexGridLayer = FlexGridLayer;
FlexGridLayer.contextTypes = {
  resizer: _propTypes["default"].object,
  layer: _propTypes["default"].object
};
FlexGridLayer.propTypes = {
  components: _propTypes["default"].array,
  LayerItem: _propTypes["default"].any,
  onLayerChange: _propTypes["default"].func,
  autoGrid: _propTypes["default"].bool,
  isResizable: _propTypes["default"].bool,
  style: _propTypes["default"].object
};