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

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var react_dom_1 = require("react-dom");

var prop_types_1 = require("prop-types"); // see: https://github.com/STRML/react-grid-layout


var react_grid_layout_1 = require("react-grid-layout");

var FlexGridLayer =
/** @class */
function (_super) {
  __extends(FlexGridLayer, _super);

  function FlexGridLayer() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.state = {
      width: 800
    };
    _this._nextVectors = [];
    return _this;
  }

  FlexGridLayer.prototype.componentDidMount = function () {
    var _this = this;
    /* eslint-disable react/no-find-dom-node */


    var dom = react_dom_1["default"].findDOMNode(this);
    this.setState({
      width: dom.offsetWidth
    }, function () {
      if (_this.context.resizer) {
        _this._cancelResize = _this.context.resizer.resize(dom, function () {
          _this.setState({
            width: dom.offsetWidth
          });
        });
      }
    });
  };

  FlexGridLayer.prototype.componentWillUnmount = function () {
    this._cancelResize && this._cancelResize();
  };

  FlexGridLayer.prototype.getGridVector = function (vectors) {
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
  };

  FlexGridLayer.prototype.render = function () {
    var _this = this;

    var _a = this.props,
        components = _a.components,
        LayerItem = _a.LayerItem,
        onLayerChange = _a.onLayerChange,
        autoGrid = _a.autoGrid,
        isResizable = _a.isResizable,
        style = _a.style;
    var editable = this.context.layer.isEditable();
    var enabled = isResizable || editable;
    var vectors = [];
    return React.createElement("div", {
      style: _extends({
        position: 'relative'
      }, style),
      className: "hc-layer hc-layer-flexGrid"
    }, React.createElement(react_grid_layout_1["default"], {
      isDraggable: enabled,
      isResizable: enabled,
      cols: 12,
      rowHeight: 100,
      width: this.state.width
    }, components.map(function (item, index) {
      var vector = item.attrs.vector;

      if (autoGrid) {
        if (!vector) {
          vector = item.attrs.vector = _this.getGridVector(vectors);
        }

        vectors.push(vector);
      }

      return React.createElement("div", {
        key: item.key || index,
        "data-tt": 1,
        "data-grid": vector
      }, React.createElement(LayerItem, _extends({
        onChange: onLayerChange
      }, item.attrs), item && item.component ? React.createElement(item.component, null) : null));
    })));
  };

  FlexGridLayer.contextTypes = {
    resizer: prop_types_1["default"].object,
    layer: prop_types_1["default"].object
  };
  FlexGridLayer.propTypes = {
    components: prop_types_1["default"].array,
    LayerItem: prop_types_1["default"].any,
    onLayerChange: prop_types_1["default"].func,
    autoGrid: prop_types_1["default"].bool,
    isResizable: prop_types_1["default"].bool,
    style: prop_types_1["default"].object
  };
  return FlexGridLayer;
}(react_1["default"].PureComponent);

exports.FlexGridLayer = FlexGridLayer;