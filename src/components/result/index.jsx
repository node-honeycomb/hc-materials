import React from 'react';
import Icon from 'antd/lib/icon';

import {NavLink} from '../navLink';

/* eslint-disable react/prop-types */
export function Result({
  className, type, title, description, extra, links, ...restProps
}) {
  const iconMap = {
    error: <Icon className="error" type="close-circle" />,
    success: <Icon className="success" type="check-circle" />,
  };
  return (
    <div className={'hc-result ' + className} {...restProps}>
      <div className="hc-result-icon">{iconMap[type]}</div>
      <div className="hc-result-title">{title}</div>
      {description && <div className="hc-result-description">{description}</div>}
      {extra && <div className="hc-result-extra">{extra}</div>}
      {links && (<div className="hc-result-actions"><NavLink links={links} /></div>)}
    </div>
  );
}
