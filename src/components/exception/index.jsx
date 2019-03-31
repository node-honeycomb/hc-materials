import React from 'react';

import {NavLink} from '../navLink';

/**
 * data = {
 *  title,
 *  desc,
 *  img
 * }
 */
/* eslint-disable react/prop-types */
export const Exception = ({className, data, links, ...rest}) => {
  return (
    <div className={'hc-exception ' + className} {...rest}>
      <div className="hc-exception-imgBlock">
        <div
          className="hc-exception-imgEle"
          style={{backgroundImage: `url(${data.img})`}}
        />
      </div>
      <div className="hc-exception-content">
        <h1>{data.title}</h1>
        <div className="hc-exception-desc">{data.desc}</div>
        {links && (<div className="hc-exception-links"><NavLink links={links} /></div>)}
      </div>
    </div>
  );
};
