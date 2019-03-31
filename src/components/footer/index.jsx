import React from 'react';
import PropTypes from 'prop-types';

export class Footer extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,

    links: PropTypes.array,
    copyright: PropTypes.string
  }

  static defaultProps = {
    className: ''
  }

  render() {
    const {className, style, links, copyright} = this.props;

    return (
      <div className={'hc-footer ' + className} style={style}>
        {links && (
          <div className="hc-footer-links">
            {links.map(link => {
              const linkProps = link.action ? {
                onClick: (e) => link.action(e, link)
              } : {
                target: link.blankTarget ? '_blank' : '_self',
                href: link.href
              };
              return (
                <a key={link.name || link.title} {...linkProps}>
                  {link.title}
                </a>
              );
            })}
          </div>
        )}
        {copyright && <div className="hc-footer-copyright">{copyright}</div>}
      </div>
    );
  }
}
