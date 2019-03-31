import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// see: https://github.com/STRML/react-grid-layout
import GridLayout from 'react-grid-layout';

export class FlexGridLayer extends React.PureComponent {
  static contextTypes = {
    resizer: PropTypes.object,
    layer: PropTypes.object
  }
  static propTypes = {
    components: PropTypes.array,
    LayerItem: PropTypes.any,
    onLayerChange: PropTypes.func,
    autoGrid: PropTypes.bool,
    isResizable: PropTypes.bool,
    style: PropTypes.object
  };

  state = {
    width: 800
  }

  _nextVectors = [];

  componentDidMount() {
    /* eslint-disable react/no-find-dom-node */
    const dom = ReactDOM.findDOMNode(this);
    this.setState({
      width: dom.offsetWidth
    }, () => {
      if (this.context.resizer) {
        this._cancelResize = this.context.resizer.resize(dom, () => {
          this.setState({
            width: dom.offsetWidth
          });
        });
      }
    });
  }

  componentWillUnmount() {
    this._cancelResize && this._cancelResize();
  }

  getGridVector(vectors) {
    if (this._nextVectors.length) {
      return this._nextVectors.shift();
    }
    const precedent = !!vectors[0];
    // 一行分6个
    const count = 12;
    // 所有高度
    const hArr = new Array(count);
    // x轴只判断一遍
    const xArr = [];
    // 最低高度
    let minHeight = precedent ? count : 0;
    // 最低高度的下标
    let minHkey = 0;
    let tmpHeight;
    for (let i = vectors.length; i--;) {
      tmpHeight = vectors[i].y + vectors[i].h;
      if (tmpHeight <= minHeight && !xArr[vectors[i].x]) {
        minHeight = tmpHeight;
        minHkey = i;
        xArr[vectors[i].x] = true;
      }
      // 首行占用了多少位置
      if (vectors[i].y === 0) {
        for (let j = 0; j < vectors[i].w; j++) {
          hArr[vectors[i].x + j] = true;
        }
      }
    }
    const minH = 3;
    const minW = 4;
    let k = 0;
    // 已占有2个宽度为准
    let fWidth = 0;
    // 有占用时的下标
    let fWkey = 0;
    if (hArr.length) {
      while (fWkey < count) {
        if (hArr[fWkey]) {
          fWkey++;
        } else {
          while (k < minW) {
            if ((fWkey + k) < count && !hArr[fWkey + k]) {
              fWidth++;
            }
            k++;
          }
          break;
        }
      }
    }
    // 未占满
    let vector;
    if (fWidth === minW) {
      vector = {x: fWkey, y: 0, w: fWidth, h: minH};
    } else if (precedent) {
      // 重要，如果一个模块下，可以容纳2个，那么就加入2个
      const mults = Math.floor(vectors[minHkey].w / minW);
      if (mults > 1) {
        vector = {x: vectors[minHkey].x, y: minHeight, w: minW, h: minH};
        for (let z = 1; z < mults; z++) {
          this._nextVectors.push({x: vectors[minHkey].x + minW * z, y: minHeight, w: minW * z, h: minH});
        }
      } else {
        vector = {x: vectors[minHkey].x, y: minHeight, w: vectors[minHkey].w, h: minH};
      }
    } else {
      vector = {x: 0, y: 0, w: minW, h: minH};
    }
    return vector;
  }

  render() {
    const {components, LayerItem, onLayerChange, autoGrid, isResizable, style} = this.props;
    const editable = this.context.layer.isEditable();
    const enabled = isResizable || editable;
    const vectors = [];
    return (
      <div style={Object.assign({position: 'relative'}, style)} className="hc-layer hc-layer-flexGrid" >
        <GridLayout isDraggable={enabled} isResizable={enabled} cols={12} rowHeight={100} width={this.state.width} >
          {components.map((item, index) => {
            let vector = item.attrs.vector;
            if (autoGrid) {
              if (!vector) {
                vector = item.attrs.vector = this.getGridVector(vectors);
              }
              vectors.push(vector);
            }
            return (<div key={item.key || index} data-tt={1} data-grid={vector}>
              <LayerItem onChange={onLayerChange} {...item.attrs} >
                {item && item.component ? (<item.component />) : null}
              </LayerItem>
            </div>);
          })}
        </GridLayout>
      </div>
    );
  }
}
