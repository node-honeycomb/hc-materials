
import React from 'react';
import PropTypes from 'prop-types';

import {bootstrap} from './bootstrap';
import {browserHistory} from 'react-router-dom';
import {Exception} from '../components/exception';
import {localeContext} from './localeContext';
const exceptions = {
  403: {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/wZcnGqRDyhPOEYFcZDnb.svg',
    title: '403'
  },
  404: {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg',
    title: '404'
  },
  500: {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/RVRUAYdCGeYNBWoKiIwB.svg',
    title: '500'
  }
};

@localeContext('Exception')
class ExceptionScene extends React.PureComponent {
  static contextTypes = {
    app: PropTypes.object
  }
  static propTypes = {
    route: PropTypes.object
  }

  render() {
    const locale = this.getLocale();
    const links = [
      {
        type: 'primary',
        size: 'large',
        name: locale.backToHome,
        action: () => {
          browserHistory.replace(this.context.app.route(bootstrap.getPrefix(this.context.app)).resolvePath);
        }
      }
    ];
    const data = exceptions[this.props.route.exception || 404];
    data.desc = locale[data.title];
    return (<Exception
      data={data}
      style={{
        minHeight: 500,
        height: '80%'
      }}
      links={links}
    />);
  }
}


export const fallbackRoutes = [
  {
    name: 'noAuth',
    component: ExceptionScene,
    hide: true,
    exception: 403
  }, {
    name: 'error',
    component: ExceptionScene,
    hide: true,
    exception: 500
  }, {
    path: '*',
    resolvePath: '*',
    component: ExceptionScene,
    hide: true,
    exception: 404
  }
];

