function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import forEach from 'lodash/forEach';
import { getComponent } from '../../layouts/getComponent';
export var Cascader =
/*#__PURE__*/
function () {
  function Cascader() {
    var _this = this;

    _classCallCheck(this, Cascader);

    // #! 维护所有组件实例的配置
    this._cascadesMap = {}; // #! 维护所有践实例引用

    this._refs = {};
    /**
     * # 装饰一个组件，并加入级联配置信息
     * @param {String} name -指定实例的名称
     * @param {Object} option - 组件的级联配置
     *
     * + getFieldDecorator函数定义
     * ```
     *  getFieldDecorator = function (name, option) {
     *    // Field当前组件的定义
     *    return function(Field) {
     *      return Hoc组件;
     *    }
     *  }
     *
     * // getFieldDecorator(a, b)(Input)
     * ```
     *
     * + option的示例结构
     * ```
     *  option = {
     *    rely,                 // 级联的来源组件实例名称
     *    event,                // 来源组件监听的事件，该事件触发后，会驱动当前组件的触发动作
     *    getVallueFormEvent,   // 触发动作调用时，会传入来源组件触发事件后带进来的值
     *    trigger,              // 当前组件的触发动作
     *    props                 // 装饰组件的额外props
     *  }
     * ```
     *
     * + this._cascadesMap示例结构
     * ```
     * cascadesMap = {
     *  a: {
     *    onChange: [{name, getValueFromEvent, trigger}, ...],
     *    onClick: []
     *  }
     * }
     * ```
     */

    this.getFieldDecorator = function (name, options) {
      var extra = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return function (Field) {
        var _extra$argIndex = extra.argIndex,
            argIndex = _extra$argIndex === void 0 ? 2 : _extra$argIndex,
            props = extra.props,
            getProps = extra.getProps;
        /**
         * + 初始化步骤
         * 1. rely有值表示当前组件和来源组件有级联关系，rely指向来源组件的实例名
         * 2. this._cascadesMap[rely]存入当前级联的配置信息，来源组件的事件作为key，值是数组
         *
         * 示例：
         * A（来源）和B有级联，通过A的onClick；当前装饰C，需要和A有级联，通过onChange；当前装饰C，需要和A有级联，通过onChange；当装饰D，D和A也做级联，而且也是通过onChange。
         *
         * A（来源）和B有级联onClick， A本身有onClick事件，alert(1); B本身onChange值介绍1个参数是不行的，必须要接受2个参数，A传给B的值放在第二个参数，同时这个参数值会存起来。
         */

        if (!Array.isArray(options)) {
          options = [options];
        }

        options.forEach(function (_ref) {
          var rely = _ref.rely,
              _ref$event = _ref.event,
              event = _ref$event === void 0 ? 'onChange' : _ref$event,
              getValueFromEvent = _ref.getValueFromEvent,
              trigger = _ref.trigger;

          if (rely) {
            _this._cascadesMap[rely] = _this._cascadesMap[rely] || {};
            var events = _this._cascadesMap[rely][event] = _this._cascadesMap[rely][event] || [];
            var item = events.find(function (item) {
              return item.name === name;
            }); // 是否有重复的级联配置存在

            if (!item) {
              events.push({
                rely: rely,
                name: name,
                getValueFromEvent: getValueFromEvent,
                trigger: trigger
              });
            }
          }
        }); // 1. 外部变量，统一在函数内部一个地方可以管理到
        // 2. 外部变量很大，存在内部变量来使用，效率更高

        var cascadesMap = _this._cascadesMap;
        var refs = _this._refs;
        /**
        * Hoc所需的getProps方法
        * @param {object} props -外部传入的props
        * @param {object} context -父级挂载的组件
        * @param {func} setState -方法
        */

        var _getProps = function _getProps(props, context, setState, istate) {
          var newProps = getProps ? getProps(props, context, setState, istate) : {}; // 拿到ref实例

          newProps.ref = function (inst) {
            // 判断是否是Hoc组件
            if (inst && inst.getRealInstance) {
              refs[name] = inst.getRealInstance();
            } else {
              refs[name] = inst;
            }
          };

          var cascadeEvents = cascadesMap[name];

          if (cascadeEvents) {
            // 遍历级联事件
            forEach(cascadeEvents, function (cascades, eventName) {
              var eventCb = newProps[eventName] || props[eventName]; // 拦截事件

              newProps[eventName] = function (e) {
                // 之前的事情触发掉。
                var ret = eventCb && eventCb(e);
                var promise = ret && ret.then ? ret : Promise.resolve(); // 在之前的事件触发完成之后再执行后续的动作

                promise.then(function () {
                  cascades.forEach(function (instObj) {
                    var value = e.target ? e.target.value : e; // 组件的实例

                    var instance = refs[instObj.name];

                    if (instance) {
                      //
                      if (argIndex !== 1 && instance._triggerParams === undefined) {
                        // 我们给B组件传入值到第二个参数
                        if (!instance._args) {
                          instance._args = [];

                          for (var i = 1; i < argIndex; i++) {
                            instance._args.push(undefined);
                          }
                        }

                        var method = typeof instObj.trigger === 'function' ? instObj.trigger : instance[instObj.trigger];

                        instance[instObj.trigger] = function () {
                          return method.apply(this, instance._args.concat(instance._triggerParams));
                        };
                      } // 约定把值传入给_triggerParams


                      instance._triggerParams = instObj.getValueFromEvent ? instObj.getValueFromEvent(value, refs[instObj.rely] ? refs[instObj.rely]._triggerParams : {}) : null;
                      instance[instObj.trigger]();
                    }
                  });
                });
                return ret;
              };
            });
          }

          return newProps;
        };
        /**
         * Hoc的通用逻辑：B -> Hoc
         * 1. 新定义组件Hoc，传入的所有的prop存在state
         * 2. render函数把state的值，以props的形式传入到A
         * 3. Hoc组件，可以通过getRealInstance获取B的实例
         */


        var HocField = getComponent(props, _getProps)(Field);

        HocField.prototype.getRealInstance = function () {
          return refs[name];
        }; // 装饰当前组件，会生成一个新的Hoc组件返回。


        return HocField;
      };
    };
  } // # 获取组件实例


  _createClass(Cascader, [{
    key: "getInstance",
    value: function getInstance(name) {
      return this._refs[name];
    }
  }]);

  return Cascader;
}();