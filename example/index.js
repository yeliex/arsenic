const App = require('@yeliex/arsenic');

const app = new App({
  cwd: process.cwd()
});

app.listen(8000).then(() => {
  // app.mq.user.listen('user_join_company', (msg) => {
  //  console.log(msg);
  // });
  // app.mq.message.send('message_test', 'this is a test message').then((res) => {
  //  console.log('res', res);
  // });
});
