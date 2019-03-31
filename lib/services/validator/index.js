"use strict";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * # 通用校验模块
 * 1. 通过定义校验规则用于校验数据合法
 * 2. 集成antd-form，校验表单合法
 */

var async_validator_1 = require("async-validator");

var hoist_non_react_statics_1 = require("hoist-non-react-statics");

var form_1 = require("antd/lib/form");

var message_1 = require("antd/lib/message");

var defer_1 = require("../../core/defer");
/**
 * + async-validator@1.6.6
 * > see: https://github.com/yiminghe/async-validator
 */


var Validator =
/** @class */
function () {
  function Validator(props, validateRules) {
    for (var key in validateRules) {
      validateRules[key] = this.pack(validateRules[key]);
    }

    this._validateRules = validateRules || {};

    this._handleSubmit = function (errors, values) {
      if (errors) {
        return false;
      } else {
        return values;
      }
    };

    this._submitting = false;
    this._validating = false;
  }

  Validator.prototype.isSubmitting = function () {
    return this._submitting;
  };

  Validator.prototype.isValidating = function () {
    return this._validating;
  };

  Validator.prototype.pack = function (rule) {
    if (Array.isArray(rule)) {
      rule = rule.map(function (item) {
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
  };

  Validator.prototype.setForm = function (form, validateRules, submitCallback) {
    this._form = form;

    if (submitCallback) {
      this._handleSubmit = submitCallback;

      if (validateRules) {
        for (var key in validateRules) {
          validateRules[key] = this.pack(validateRules[key]);
        }

        this._validateRules = validateRules;
      }
    } else if (validateRules) {
      this._handleSubmit = validateRules;
    }
  };

  Validator.prototype.reset = function () {
    this._form.resetFields();
  };

  Validator.prototype.getProps = function (fieldName, rule) {
    if (this._validateRules[fieldName]) {
      return assignDeep(this._validateRules[fieldName], rule && this.pack(rule));
    } else {
      return rule && this.pack(rule);
    }
  }; // #! for antd-form


  Validator.prototype.getFieldProps = function (fieldName, option) {
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

    return this._form.getFieldProps(fieldName, option);
  };

  Validator.prototype.getFieldDecorator = function (fieldName, option) {
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

    return this._form.getFieldDecorator(fieldName, option);
  };

  Validator.prototype._validate = function (opt) {
    var _this = this;

    var defer = new defer_1.Deferred();
    this._validating = true;

    this._form.setFields();

    opt.preCallback && opt.preCallback();

    var callback = function callback(errors, values) {
      _this._validating = false;

      var postCallback = function postCallback() {
        opt.postCallback && opt.postCallback();

        _this._form.setFields();
      };

      if (errors) {
        if (opt.catchError) {
          opt.catchError(errors);
        } else {
          message_1["default"].error('表单校验失败');
        }

        postCallback();
        return defer.reject(false);
      }

      var result = opt.callback && opt.callback(errors, values);

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
      new async_validator_1["default"](this._validateRules).validate(opt.source, callback);
    } else {
      this._form[opt.method](callback);
    }

    return defer.promise;
  };

  Validator.prototype.validateFields = function (callback, catchError) {
    return this._validate({
      method: 'validateFields',
      callback: callback,
      catchError: catchError
    });
  };

  Validator.prototype.validateFieldsAndScroll = function (callback, catchError) {
    return this._validate({
      method: 'validateFieldsAndScroll',
      callback: callback,
      catchError: catchError
    });
  };

  Validator.prototype.validate = function (source, callback, catchError) {
    return this._validate({
      source: source,
      callback: callback,
      catchError: catchError
    });
  };

  Validator.prototype.submit = function (_callback, catchError) {
    var _this = this;

    return this._validate({
      method: 'validateFieldsAndScroll',
      preCallback: function preCallback() {
        _this._submitting = true;
      },
      postCallback: function postCallback() {
        _this._submitting = false;
      },
      callback: function callback(errors, values) {
        values = _this._handleSubmit(errors, values);

        if (values === false) {
          return false;
        } else {
          return _callback(values);
        }
      },
      catchError: catchError
    });
  };

  Validator.enhanceForm = function (option) {
    return function (BaseComponent) {
      var Component = form_1["default"].create(_extends(option || {}, {
        withRef: true
      }))(BaseComponent);

      Component.prototype.getRealInstance = function () {
        return this.refs.wrappedComponent.refs.formWrappedComponent;
      };

      return hoist_non_react_statics_1["default"](Component, BaseComponent);
    };
  };

  Validator.validate = function (rules, source, callback) {
    var descriptor = {};

    for (var key in rules) {
      if (typeof rules[key] === 'boolean') {
        descriptor[key] = {
          type: 'string',
          required: rules[key]
        };
      } else {
        descriptor[key] = rules[key];
      }
    }

    var validator = new async_validator_1["default"](descriptor);
    validator.validate(source, callback);
  };
  /* eslint-disable camelcase */


  Validator.templates = {
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
  };
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

  Validator.$inject = ['props', 'validateRules'];
  return Validator;
}();

exports.Validator = Validator;

function assignDeep(obj, newObj) {
  if (Array.isArray(obj)) {
    return obj.map(function (item, index) {
      return assignDeep(item, newObj[index]);
    });
  } else {
    return _extends(obj, newObj);
  }
}