exports.mq = {
  enable: true,
  tags: '*',
  namesrvAddr: 'localhost:9876',
  onsAddr: '',
  topics: {
    service_user: {
      consumer: 'CID_service_user',
      producer: ''
    }
  }
};
