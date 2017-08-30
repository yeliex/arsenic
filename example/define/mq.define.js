/**
 *
 * @file mq.define.js
 * @author: yeliex
 * @create: 2017/8/28 上午9:51
 */

module.exports = {
  user: {
    consumer: 'CID_service_node_message_user',
    topic: 'service_user',
    tags: [
      'user_join_company',
      'user_leave_company'
    ]
  },
  message: {
    producer: 'PID_service_node_message',
    topic: 'service_node_message'
  }
};
