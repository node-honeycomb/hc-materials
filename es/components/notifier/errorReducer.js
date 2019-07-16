/**
 * ### 集成到reducer中
 * 在redux体系中，一旦有action触发，所有的reducer都会调用一次，而errorReducer会专门判断action是否包含error属性，包含即认定action发生了错误。
 *
 * 识别action发生错误的基本结构：
 *
 * ```javascript
 *  action = {
 *    suppressGlobalErrorNotification: Boolean, // 为true表示忽略错误
 *    error: { // 否则认定发生了错误，需要做提示。
 *      errorNotification: Notifier, // 存在则通过告警器来做提示
 *      response: Response, // 发生错误的响应体，比如http请求的返回结果
 *      message: String, // 简单错误提示
 *    }
 *  }
 * ```
 */
import { Notifier } from './notifier';
export function errorReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  if (!action.error || action.suppressGlobalErrorNotification) {
    return state;
  }

  if (action.error.errorNotification) {
    action.error.errorNotification.notify({
      content: action.error.message || action.error.response,
      trace: true
    });
  } else {
    var errorNotification = Notifier.notifierFactory('error', action.error.title, action.error.response || action.error.message);
    errorNotification.notify({
      trace: true
    });
  }

  return action.error;
}