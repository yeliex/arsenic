const Consumer = require('rocketmq').Consumer;
const urllib = require('urllib');

const consumer = new Consumer({
  consumerGroup: 'CID_node_service_message_user',
  namesrvAddr: '192.168.1.161:9876',
  urllib
});

consumer.subscribe('service_user', 'user_join_company || user_leave_company');

consumer.on('message', (msg, ack) => {
  console.log(msg);
});

consumer.ready(() => console.log('consumer is ready'));

//const Consumer = require('ons').Consumer;
//
//const consumer = new Consumer('CID_service_user', 'service_user', '*', 'LTAIv6DBbsA4Uag6','dfVhU6TfRr0fVUQpVzHdTMvSE1LLye', {
//  //namesrvAddr: '192.168.1.161:9876',
//  onsAddr: "http://onsaddr-internet.aliyun.com:80/rocketmq/nsaddr4client-internet",
//  threadNum: 1
//});
//
//consumer.on('message', (msg, ack) => {
//  console.log(msg);
//});
//
//consumer.init(function(err) {
//  if (err) return console.log(err);
//  consumer.listen();
//});
