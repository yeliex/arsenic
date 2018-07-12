exports.plugins = {
  elastic: {
    enable: true,
    host: 'http://localhost:9200/'
  },
  mysql: {
    enable: true
  },
  redis: {
    enable: true,
    host: 'localhost'
  },
  mq: {
    enable: false,
    namesrvAddr: 'localhost:9876'
  }
};
