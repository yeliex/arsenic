/**
 *
 * @file mq.define.js
 * @author: yeliex
 * @create: 2017/8/28 上午9:51
 */

module.exports = {
  user: {
    comsumer: 'CID_node_service_message_user',
    topic: 'service_user',
    tags: [
      'user_join_company',
      'user_leave_company'
    ]
  }
};
