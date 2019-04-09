
import React from 'react';
import PropTypes from 'prop-types';

import {bootstrap} from './bootstrap';
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

@localeContext('Exception', {
  backToHome: '返回首页',
  403: '抱歉，你无权访问该页面',
  404: '抱歉，你访问的页面不存在',
  500: '抱歉，服务器出错了'
})
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
          this.app.replace(this.context.app.route(bootstrap.getPrefix(this.context.app)).resolvePath);
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

