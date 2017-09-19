exports.plugins = {
  elastic: {
    enable: true,
    host: 'http://192.168.1.117:9200/'
  },
  mysql: {
    enable: true
  },
  redis: {
    enable: true,
    host: '192.168.1.117'
  },
  mq: {
    enable: true,
    namesrvAddr: '192.168.1.161:9876'
  }
};