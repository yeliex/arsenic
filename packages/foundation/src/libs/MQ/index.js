/**
 *
 * @file index
 * @author: yeliex
 * @create: 2017/8/30 上午10:37
 */

const MQ = require('./MQ');

Object.defineProperties(MQ, {
  Message: require('./Message'),
  Topic: require('./Topic')
});

module.exports = MQ;
