"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Validator = void 0;

var _asyncValidator = _interopRequireDefault(require("async-validator"));

var _hoistNonReactStatics = _interopRequireDefault(require("hoist-non-react-statics"));

var _form = _interopRequireDefault(require("antd/lib/form"));

var _message = _interopRequireDefault(require("antd/lib/message"));

var _defer = require("../../core/defer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * + async-validator@1.6.6
 * > see: https://github.com/yiminghe/async-validator
 */
var Validator =
/*#__PURE__*/
function () {
  function Validator(props, validateRules) {
    _classCallCheck(this, Validator);

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

  _createClass(Validator, [{
    key: "isSubmitting",
    value: function isSubmitting() {
      return this._submitting;
    }
  }, {
    key: "isValidating",
    value: function isValidating() {
      return this._validating;
    }
  }, {
    key: "pack",
    value: function pack(rule) {
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
    }
  }, {
    key: "setForm",
    value: function setForm(form, validateRules, submitCallback) {
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
    }
  }, {
    key: "reset",
    value: function reset() {
      this._form.resetFields();
    }
  }, {
    key: "getProps",
    value: function getProps(fieldName, rule) {
      if (this._validateRules[fieldName]) {
        return assignDeep(this._validateRules[fieldName], rule && this.pack(rule));
      } else {
        return rule && this.pack(rule);
      }
    } // #! for antd-form

  }, {
    key: "getFieldProps",
    value: function getFieldProps(fieldName, option) {
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
    }
  }, {
    key: "getFieldDecorator",
    value: function getFieldDecorator(fieldName, option) {
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
    }
  }, {
    key: "_validate",
    value: function _validate(opt) {
      var _this = this;

      var defer = new _defer.Deferred();
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
            _message["default"].error('表单校验失败');
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
        new _asyncValidator["default"](this._validateRules).validate(opt.source, callback);
      } else {
        this._form[opt.method](callback);
      }

      return defer.promise;
    }
  }, {
    key: "validateFields",
    value: function validateFields(callback, catchError) {
      return this._validate({
        method: 'validateFields',
        callback: callback,
        catchError: catchError
      });
    }
  }, {
    key: "validateFieldsAndScroll",
    value: function validateFieldsAndScroll(callback, catchError) {
      return this._validate({
        method: 'validateFieldsAndScroll',
        callback: callback,
        catchError: catchError
      });
    }
  }, {
    key: "validate",
    value: function validate(source, callback, catchError) {
      return this._validate({
        source: source,
        callback: callback,
        catchError: catchError
      });
    }
  }, {
    key: "submit",
    value: function submit(_callback, catchError) {
      var _this2 = this;

      return this._validate({
        method: 'validateFieldsAndScroll',
        preCallback: function preCallback() {
          _this2._submitting = true;
        },
        postCallback: function postCallback() {
          _this2._submitting = false;
        },
        callback: function callback(errors, values) {
          values = _this2._handleSubmit(errors, values);

          if (values === false) {
            return false;
          } else {
            return _callback(values);
          }
        },
        catchError: catchError
      });
    }
  }]);

  return Validator;
}();

exports.Validator = Validator;

Validator.enhanceForm = function (option) {
  return function (BaseComponent) {
    var Component = _form["default"].create(_extends(option || {}, {
      withRef: true
    }))(BaseComponent);

    Component.prototype.getRealInstance = function () {
      return this.refs.wrappedComponent.refs.formWrappedComponent;
    };

    return (0, _hoistNonReactStatics["default"])(Component, BaseComponent);
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

  var validator = new _asyncValidator["default"](descriptor);
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

function assignDeep(obj, newObj) {
  if (Array.isArray(obj)) {
    return obj.map(function (item, index) {
      return assignDeep(item, newObj[index]);
    });
  } else {
    return _extends(obj, newObj);
  }
}