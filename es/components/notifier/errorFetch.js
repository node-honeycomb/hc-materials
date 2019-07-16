import { Notifier } from './notifier';
export function errorFetch(res, errorNotification) {
  var checkStatus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
  var statusResult = checkStatus(res);

  if (statusResult) {
    var error = new Error(statusResult.message || res.message || '');
    error.response = res;
    error.errorNotification = new Notifier({
      type: 'error',
      level: 'two',
      trace: true,
      title: statusResult.title || '错误提示'
    });
    throw error;
  }

  return res;
}