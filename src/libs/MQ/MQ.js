const { Consumer, Producer } = require('rocketmq');
const urllib = require('urllib');
const _ = require('lodash');
const Topic = require('./Topic');

const mq = {
  config: {}
};

class MQ {
  constructor(config, define = []) {
    mq.config = config;
    Object.keys(define).forEach((name) => {
      this[_.camelCase(name)] = new Topic(define[name], config);
    });
  }
}

module.exports = MQ;
