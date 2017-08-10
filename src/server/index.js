const http = require('http');
const Koa = require('koa');
const router = require('koa-router')();
const koaBody = require('koa-better-body');
const convert = require('koa-convert');
const compose = require('koa-compose');

const middleware = require('../middlewares/index');
const errorHandler = require('../libs/errorHandler');

process.on('uncaughtException', (e) => {
  console.error(e);
});

process.on('unhandledRejection', (e) => {
  e.then ? e.then((e) => {
    console.error(e);
  }) : console.error(e);
});

module.exports = function Server({ cwd = process.cwd() } = {}) {
  const app = new Koa();

  app.use(compose([].concat(
    [
      middleware.healthCheck(),
      middleware.response(),
      middleware.errorHandler(),
      middleware.headers(),
      middleware.fetch()
    ],
    middleware.router({ cwd }),
    middleware.controller({ cwd })
  )));

  app.on('error', errorHandler);

  router.all('*', async (ctx) => {
    ctx.throw();
  });

  app.use(router.routes()).use(router.allowedMethods({ throw: true }));

  app.listen = (port, callback) => {
    const server = http.createServer(app.callback());
    server.listen(port, () => {
      if (server.listening) {
        console.log(`server start listening at ${port}`);
      } else {
        console.error(`server start listening failed`);
      }
      if (typeof callback === 'function') {
        callback(server.listening);
      }
    });
  };

  return app;
};
