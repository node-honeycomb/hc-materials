import React from 'react';

import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import {CopyLogger} from './copyLogger';
// 默认8秒
notification.config({
  duration: 8
});
// 默认4秒
message.config({
  duration: 4,
});

const seniorNotification = Object.assign({}, notification);
['success', 'info', 'warning', 'error', 'warn'].forEach((type) => {
  seniorNotification[type] = (args) => notification[type](Object.assign({}, args, {type, duration: null}));
});

export class Notifier {
  static strategy = {
    one: message,
    two: notification,
    three: seniorNotification
  };

  constructor(opt = {}, immediate) {
    this.$opt_ = opt;
    if (immediate) {
      this.notify(opt);
    }
  }

  notify(opt) {
    const strategy = Notifier.strategy;
    // 特殊处理
    if (opt.rid) {
      opt = {
        content: opt
      };
    }
    opt = Object.assign({type: 'info', level: 'one'}, this.$opt_, opt);

    if (opt.trace) {
      delete this.$opt_.trace;
      delete opt.trace;
      if (opt.content.then) {
        opt.content.then(res => {
          if (Object(res) !== res) {
            res = {
              message: res
            };
          }
          const rid = opt.rid || res.rid;
          if (rid) {
            opt.content = (<div><span>{res.message}</span><CopyLogger rid={rid} message={'rid: ' + rid} /></div>);
          } else {
            opt.content = res.message;
          }
          this.notify(opt);
        }, err => {
          opt.content = err.message;
          this.notify(opt);
        });
      } else {
        if (Object(opt.content) === opt.content) {
          const rid = opt.rid || opt.content.rid;
          const content = opt.content.message;
          if (rid) {
            opt.content = (<div><span>{content}</span><CopyLogger rid={rid} message={'rid: ' + rid} /></div>);
          } else {
            opt.content = content;
          }
        }
        this.notify(opt);
      }
    } else {
      // notification 和 message的初始化方式不同
      if (strategy[opt.level] === notification) {
        strategy[opt.level][opt.type]({
          message: opt.title || '提示',
          description: opt.content,
          btn: opt.btn,
          icon: opt.icon,
          key: opt.key,
          onClose: opt.onClose,
          duration: opt.duration
        });
      } else {
        strategy[opt.level][opt.type](opt.content, opt.duration);
      }
    }
  }

  static notifierFactory(type, title, content) {
    return new Notifier({
      level: 'two',
      type: type,
      title: title || '错误异常',
      content: content,
      trace: true
    });
  }

  static error(title, content) {
    if (content) {
      return new Notifier({
        type: 'error',
        level: 'two',
        title,
        content
      }, 1);
    } else {
      return new Notifier({
        type: 'error',
        level: 'one',
        content: title
      }, 1);
    }
  }

  static success(title, content) {
    if (content) {
      return new Notifier({
        type: 'success',
        level: 'two',
        title,
        content
      }, 1);
    } else {
      return new Notifier({
        type: 'success',
        level: 'one',
        content: title
      }, 1);
    }
  }

  static info(title, content) {
    if (content) {
      return new Notifier({
        type: 'info',
        level: 'two',
        title,
        content
      }, 1);
    } else {
      return new Notifier({
        type: 'info',
        level: 'one',
        content: title
      }, 1);
    }
  }

  static warn(title, content) {
    if (content) {
      return new Notifier({
        type: 'warn',
        level: 'two',
        title,
        content
      }, 1);
    } else {
      return new Notifier({
        type: 'warn',
        level: 'one',
        content: title
      }, 1);
    }
  }
}

