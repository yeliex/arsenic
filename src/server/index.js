const http = require('http');
const Koa = require('koa');
const router = require('koa-router')();
const koaBody = require('koa-better-body');
const convert = require('koa-convert');
const compose = require('koa-compose');

const middlewares = require('../middlewares');
const loaders = require('../loaders');
const errorHandler = require('../libs/error_handler');

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
      middlewares.healthCheck(),
      middlewares.response(),
      middlewares.errorHandler(),
      middlewares.headers(),
      middlewares.fetch()
    ],
    loaders.service({ cwd }),
    loaders.controller({ cwd }),
    loaders.router({ cwd })
  )));

  app.on('error', errorHandler);

  app.router = router;

  app.listen = (port, callback) => {
    router.all('*', async (ctx) => {
      ctx.throw();
    });

    app.use(router.routes()).use(router.allowedMethods({ throw: true }));

    delete app.router;

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
