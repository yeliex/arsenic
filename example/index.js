const App = require('../src');

const app = new App({
  cwd: process.cwd()
});

app.listen(8000, (listening) => {
  console.log('listening');
});
