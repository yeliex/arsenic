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
  const config = loaders.config({ cwd });

  const app = new Koa();

  app.config = config;

  app.sequelize = loaders.sequelize(app.config);

  const logger = loaders.logger;

  logger.regist(app.config);

  app.logger = logger;

  loaders.middleware.regist(app.config);

  app.use(compose([].concat(
    config.middleware(),
    [
      middlewares.healthCheck(app.config),
      logger.middleware(),
      logger.accessMiddleware(),
      middlewares.response(app.config),
      middlewares.cors(app.config),
      middlewares.errorHandler(app.config),
      middlewares.bodyParser(),
      app.sequelize.middleware(),
      middlewares.headers(app.config),
      middlewares.fetch(app.config)
    ],
    loaders.service(app.config),
    loaders.controller(app.config),
    loaders.router(app.config)
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
        logger.app.info(`server start listening at ${port}`);
      } else {
        logger.app.error(`server start listening failed`);
      }
      if (typeof callback === 'function') {
        callback(server.listening);
      }
    });
  };

  return app;
};
