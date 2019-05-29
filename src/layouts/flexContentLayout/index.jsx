import React from 'react';
import PropTypes from 'prop-types';

import {Card, Affix, Icon, Drawer, Divider} from 'antd';

import {BreadCrumb} from '../../components/breadCrumb';
import {Footer} from '../../components/footer';
import {BasicLayout} from '../basicLayout';

const styles = {
  root: {
    flexGrow: 1,
  },
  appFrame: {
    minHeight: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative'
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px'
  },
  drawerHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px'
  },
  content: {
    flexGrow: 1,
    padding: 0,
  },
  'contentShift-left': {
    marginLeft: 0,
  },
  'contentShift-right': {
    marginRight: 0,
  },
  iconSelected: {
    color: '#00bfdc',
    background: '#e6f7ff',
    boxShadow: '-1px -1px 1px #c5dff5'
  },
  title: {
    height: 30,
    width: '100%',
    lineHeight: '30px',
    paddingLeft: '10px',
    whiteSpace: 'nowrap',
    wordBreak: 'break-all',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  }
};
export class FlexContentLayout extends BasicLayout {
  static layoutBlocks = {
    Footer: Footer,
    BreadCrumb
  }

  static propTypes = {
    className: PropTypes.string,
    leftTitle: PropTypes.node,
    rightTitle: PropTypes.node,
    drawerStyle: PropTypes.object,
    openLeft: PropTypes.bool,
    openRight: PropTypes.bool,
    hasSider: PropTypes.bool,
    drawerWidth: PropTypes.number,
    zIndex: PropTypes.number,
    affix: PropTypes.bool,
    style: PropTypes.object,
    mainStyle: PropTypes.object,
    contentStyle: PropTypes.object
  }

  static defaultProps = {
    drawerWidth: 200,
    overviewWidth: 250,
    affix: true,
    style: {},
    mainStyle: {},
    contentStyle: {}
  }

  constructor(props) {
    super(props);
    const drawerStyle = Object.assign({zIndex: this.props.zIndex || 1000, position: 'absolute'}, props.drawerStyle);
    this.state = {
      openLeft: !!this.props.openLeft,
      openRight: !!this.props.openRight,
      drawerStyle: drawerStyle
    };
    this._beforeDrawer = React.createRef();
    this._afterDrawer = React.createRef();
  }

  handleLeftDrawer = (open) => {
    if (open === false) {
      this.setState({openLeft: false});
    } else {
      this.setState({openLeft: !this.state.openLeft}); // openProcessor: false
    }
  };

  handleRightDrawer = (open) => {
    if (open === false) {
      this.setState({openRight: false});
    } else {
      this.setState({openRight: !this.state.openRight});
    }
  };

  handleRightDrawerClose = () => {
    this.setState({openRight: false});
  };

  render() {
    const Footer = this.getComponent('Footer');
    const BreadCrumb = this.getComponent('BreadCrumb');

    const LeftDrawer = this.getComponent('LeftDrawer');
    const RightDrawer = this.getComponent('RightDrawer');
    const Overview = this.getComponent('Overview');
    const Combox = this.getComponent('Combox');
    const {className, drawerWidth, contentStyle, overviewWidth, leftTitle, rightTitle, affix, style, mainStyle} = this.props;
    const {drawerStyle, openLeft, openRight} = this.state;
    const hasOverview = this.hasComponent('Overview');
    const hasLeftDrawer = this.hasComponent('LeftDrawer');
    const hasRightDrawer = this.hasComponent('RightDrawer');

    const StepConnector = this.getComponent('StepConnector');
    const hasStepConnector = this.hasComponent('StepConnector');

    contentStyle.minHeight = this.hasComponent('Footer') ? 'calc(100% - 142px)' : 'calc(100% - 62px)';
    const beforeDrawer = hasLeftDrawer ? (
      <Drawer
        placement="left"
        mask={false}
        closable={false}
        visible={openLeft}
        getContainer={() => this._beforeDrawer.current}
        bodyStyle={styles.drawerPaper}
        width={drawerWidth}
        style={drawerStyle}
      >
        <div style={styles.drawerHeader}>
          <div style={styles.title}>{leftTitle}</div>
          <Icon type="left-square-o" onClick={() => this.handleLeftDrawer(false)}  />
        </div>
        <Divider />
        <LeftDrawer className="hc-layout-flexContent-leftDrawer" />
      </Drawer>
    ) : null;
    const afterDrawer = hasRightDrawer ? (
      <Drawer
        placement="right"
        mask={false}
        closable={false}
        visible={openRight}
        getContainer={() => this._afterDrawer.current}
        bodyStyle={styles.drawerPaper}
        width={drawerWidth}
        style={drawerStyle}
      >
        <div style={styles.drawerHeaderRight}>
          <Icon type="right-square-o" onClick={() => this.handleRightDrawer(false)} />
          <div style={styles.title}>{rightTitle}</div>
        </div>
        <Divider />
        <RightDrawer className="hc-layout-flexContent-rightDrawer" />
      </Drawer>
    ) : null;
    const Head = (<div className="hc-layout-flexContent-iconbox">
      {hasLeftDrawer ? (<Icon type="compass" onClick={this.handleLeftDrawer} style={openLeft ? styles.iconSelected : {}} />) : null}
      {hasRightDrawer ? (<Icon type="appstore-o" onClick={this.handleRightDrawer} style={openRight ? styles.iconSelected : {}} />) : null}
      {hasStepConnector ? (<div className="hc-layout-flexContent-connector"><StepConnector /></div>) : null}
      <BreadCrumb className="hc-layout-flexContent-breadCrumb" style={{marginLeft: hasLeftDrawer ? 35 : 0, marginRight: hasRightDrawer ? 35 : 0, paddingTop: 8}} />
    </div>);
    return (
      <div className={'hc-layout-flexContent ' + className} style={Object.assign({}, style, styles.root)}>
        {affix ? (<Affix>{Head}</Affix>) : Head}
        <div style={styles.appFrame}>
          <div ref={this._beforeDrawer}></div>
          {beforeDrawer}
          <main
            style={Object.assign(
              {
                minHeight: document.body.offsetHeight - 107
              },
              styles.content,
              mainStyle,
              openLeft ? {marginLeft: drawerWidth} : styles['contentShift-left'],
              openRight ? {marginRight: drawerWidth} : styles['contentShift-right']
            )}
          >
            <div style={styles.drawerHeader} />
            <Card bordered={false} className="hc-layout-flexContent-body" style={contentStyle}>
              <div className="hc-layout-flexContent-body_wrap" style={{width: hasOverview ? 'calc(100% - ' + overviewWidth + 'px)' : ''}}>{this.props.viewContent || this.props.children}</div>
              <div  className="hc-layout-flexContent-body_overview" style={{flexBasis: overviewWidth, display: hasOverview ? '' : 'none'}}>
                <Overview />
              </div>
            </Card>
            <Combox />
            <Footer className="hc-layout-flexContent-footer" />
          </main>
          <div ref={this._afterDrawer}></div>
          {afterDrawer}
        </div>
      </div>
    );
  }
}
