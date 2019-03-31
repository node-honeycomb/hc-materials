"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var notifier_1 = require("./notifier");

function errorFetch(res, errorNotification, checkStatus) {
  if (checkStatus === void 0) {
    checkStatus = function checkStatus() {};
  }

  var statusResult = checkStatus(res);

  if (statusResult) {
    var error = new Error(statusResult.message || res.message || '');
    error.response = res;
    error.errorNotification = new notifier_1.Notifier({
      type: 'error',
      level: 'two',
      trace: true,
      title: statusResult.title || '错误提示'
    });
    throw error;
  }

  return res;
}

exports.errorFetch = errorFetch;