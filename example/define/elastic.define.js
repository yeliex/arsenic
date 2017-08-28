/**
 *
 * @file mysql.define.js
 * @author: yeliex
 * @create: 2017/8/24 下午2:31
 */
module.exports = (elastic) => {
  elastic.define('message', {}, {
    index: 'im_message',
    type: 'message'
  });

  return elastic.models;
};
