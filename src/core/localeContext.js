import propTypes from 'prop-types';

export function localeContext(name, defaultLocale) {
  return BaseComponent => {
    BaseComponent.contextTypes = Object.assign(BaseComponent.contextTypes || {}, {hcLocale: propTypes.object, antLocale: propTypes.object});

    BaseComponent.prototype.getLocale = function (key) {
      let locale;
      if (this._locale) {
        locale = this._locale;
      } else {
        const hcLocale = this.context.hcLocale || this.context.antLocale || {};
        locale = this._locale = Object.assign(defaultLocale, hcLocale[name], this.props && this.props.locale);
      }

      if (key) {
        return locale[key];
      } else {
        return locale;
      }
    };
    return BaseComponent;
  };
}
