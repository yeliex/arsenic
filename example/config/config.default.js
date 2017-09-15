exports.mq = {
  enable: true,
  tags: '*',
  namesrvAddr: '192.168.1.161:9876',
  onsAddr: '',
  topics: {
    service_user: {
      consumer: 'CID_node_service_message_user',
      producer: ''
    }
  }
};
