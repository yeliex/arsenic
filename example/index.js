const App = require('../src');

const app = new App({
  cwd: process.cwd()
});

app.router.get('*', async (ctx) => {
  //console.log(ctx.controller);
});

app.listen(8000, (listening) => {
  console.log('listening');
});
