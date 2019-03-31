import {Notifier} from './notifier';

export function errorFetch(res, errorNotification, checkStatus = () => {}) {
  let statusResult = checkStatus(res);
  if (statusResult) {
    const error = new Error(statusResult.message || res.message || '');
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
