/**
 * # 通用校验模块
 * 1. 通过定义校验规则用于校验数据合法
 * 2. 集成antd-form，校验表单合法
 */
import AsyncValidator from 'async-validator';
import hoistNonReactStatics from 'hoist-non-react-statics';
import Form from 'antd/lib/form';
import message from 'antd/lib/message';
import {Deferred} from '../../core/defer';

/**
 * + async-validator@1.6.6
 * > see: https://github.com/yiminghe/async-validator
 */
export class Validator {
  static enhanceForm = (option) => BaseComponent => {
    const Component = Form.create(Object.assign(option || {}, {withRef: true}))(BaseComponent);
    Component.prototype.getRealInstance = function () {
      return this.refs.wrappedComponent.refs.formWrappedComponent;
    };
    return hoistNonReactStatics(Component, BaseComponent);
  }

  static validate = (rules, source, callback) => {
    const descriptor = {};
    for (let key in rules) {
      if (typeof rules[key] === 'boolean') {
        descriptor[key] = {
          type: 'string',
          required: rules[key]
        };
      } else {
        descriptor[key] = rules[key];
      }
    }
    const validator = new AsyncValidator(descriptor);
    validator.validate(source, callback);
  }

  /* eslint-disable camelcase */
  static templates = {
    pattern: {
      // #! 中英字母数字下划线
      legal: /^[A-Za-z0-9_\u4e00-\u9fa5]*$/,
      // #! 必须是字母数字、下划线、中划线以及
      light_legal: /^[A-Za-z0-9._-]*$/,
      // #! 以字母开头，不能包含中文或特殊字符
      light_light_legal: /^[a-zA-Z]\w*$/,
      // #! 中英字母数字下划线
      dark_legal: /^[A-Za-z0-9_\u4e00-\u9fa5]*$/,
      // #! 必须是中英字母数字下划线以及.
      dark_dark_legal: /^[A-Za-z0-9._\u4e00-\u9fa5]*$/
    }
  }
  /**
   * + 校验规则
   * ```
   * fieldRules = [{
   *  [fieldName]: {
   *    type: ['string', 'number', 'boolean', 'method', 'regexp', 'integer', 'float', 'array', 'object', 'enum', 'date', 'url', 'hex', 'email'],
   *    required,
   *    pattern,
   *    whitespace,
   *    transform,
   *    message,
   *    validator,
   *    [range(min, max): 'string' | 'array' | 'integer'],
   *    [length: 'string' | 'array']
   *    [enum: 'enum'],
   *    [fields: 'deep rules'],
   *    [defaultField: 'array' | 'object']
   *  }
   * },...]
   * ```
   */
  static $inject = ['props', 'validateRules'];

  constructor(props, validateRules) {
    for (let key in validateRules) {
      validateRules[key] = this.pack(validateRules[key]);
    }
    this._validateRules = validateRules || {};
    this._handleSubmit = (errors, values) => {
      if (errors) {
        return false;
      } else {
        return values;
      }
    };
    this._submitting = false;
    this._validating = false;
  }

  isSubmitting() {
    return this._submitting;
  }

  isValidating() {
    return this._validating;
  }

  pack(rule) {
    if (Array.isArray(rule)) {
      rule = rule.map(item => {
        if (typeof item.pattern === 'string') {
          item.pattern = Validator.templates.pattern[item.pattern];
        }
        return item;
      });
    } else {
      if (typeof rule.pattern === 'string') {
        rule.pattern = Validator.templates.pattern[rule.pattern];
      }
    }
    return rule;
  }

  setForm(form, validateRules, submitCallback) {
    this._form = form;
    if (submitCallback) {
      this._handleSubmit = submitCallback;
      if (validateRules) {
        for (let key in validateRules) {
          validateRules[key] = this.pack(validateRules[key]);
        }
        this._validateRules = validateRules;
      }
    } else if (validateRules) {
      this._handleSubmit = validateRules;
    }
  }

  reset() {
    this
      ._form
      .resetFields();
  }

  getProps(fieldName, rule) {
    if (this._validateRules[fieldName]) {
      return assignDeep(this._validateRules[fieldName], rule && this.pack(rule));
    } else {
      return rule && this.pack(rule);
    }
  }

  // #! for antd-form
  getFieldProps(fieldName, option) {
    if (!option.rules && option.rule) {
      option.rules = [option.rule];
    }
    if (this._validateRules[fieldName]) {
      // option.rules = assignDeep([].concat(this._validateRules[fieldName]),
      // option.rules && this.pack(option.rules) || []);
      option.rules = [].concat(this._validateRules[fieldName], option.rules && this.pack(option.rules) || []);
    } else if (option.rules) {
      option.rules = this.pack(option.rules);
    }
    return this
      ._form
      .getFieldProps(fieldName, option);
  }

  getFieldDecorator(fieldName, option) {
    if (!option.rules && option.rule) {
      option.rules = [option.rule];
    }
    if (this._validateRules[fieldName]) {
      // option.rules = assignDeep([].concat(this._validateRules[fieldName]),
      // option.rules && this.pack(option.rules) || []);
      option.rules = [].concat(this._validateRules[fieldName], option.rules && this.pack(option.rules) || []);
    } else if (option.rules) {
      option.rules = this.pack(option.rules);
    }
    return this
      ._form
      .getFieldDecorator(fieldName, option);
  }

  _validate(opt) {
    const defer = new Deferred();
    this._validating = true;
    this._form.setFields();
    opt.preCallback && opt.preCallback();
    const callback = (errors, values) => {
      this._validating = false;
      const postCallback = () => {
        opt.postCallback && opt.postCallback();
        this._form.setFields();
      };
      if (errors) {
        if (opt.catchError) {
          opt.catchError(errors);
        } else {
          message.error('表单校验失败');
        }
        postCallback();
        return defer.reject(false);
      }

      const result = opt.callback && opt.callback(errors, values);
      if (result && result.then) {
        result.then(defer.resolve, defer.reject);
      } else if (result === false) {
        defer.reject(false);
      } else {
        defer.resolve(result);
      }
      defer.promise.then(postCallback, postCallback);
    };
    if (opt.source) {
      new AsyncValidator(this._validateRules).validate(opt.source, callback);
    } else {
      this._form[opt.method](callback);
    }
    return defer.promise;
  }

  validateFields(callback, catchError) {
    return this._validate({
      method: 'validateFields',
      callback: callback,
      catchError: catchError
    });
  }

  validateFieldsAndScroll(callback, catchError) {
    return this._validate({
      method: 'validateFieldsAndScroll',
      callback: callback,
      catchError: catchError
    });
  }

  validate(source, callback, catchError) {
    return this._validate({
      source: source,
      callback: callback,
      catchError: catchError
    });
  }

  submit(callback, catchError) {
    return this._validate({
      method: 'validateFieldsAndScroll',
      preCallback: () => {
        this._submitting = true;
      },
      postCallback: () => {
        this._submitting = false;
      },
      callback: (errors, values) => {
        values = this._handleSubmit(errors, values);
        if (values === false) {
          return false;
        } else {
          return callback(values);
        }
      },
      catchError: catchError
    });
  }
}

function assignDeep(obj, newObj) {
  if (Array.isArray(obj)) {
    return obj.map((item, index) => {
      return assignDeep(item, newObj[index]);
    });
  } else {
    return Object.assign(obj, newObj);
  }
}
