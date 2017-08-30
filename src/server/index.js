/* eslint-disable no-underscore-dangle */
const http = require('http');
const Koa = require('koa');
const router = require('koa-router')();
const koaBody = require('koa-better-body');
const convert = require('koa-convert');
const compose = require('koa-compose');

const middlewares = require('../middlewares');
const plugins = require('../plugins');
const errorHandler = require('../libs/error_handler');

process.on('uncaughtException', (e) => {
  console.error(e);
});

process.on('unhandledRejection', (e) => {
  e.then ? e.then((e) => {
    console.error(e);
  }) : console.error(e);
});

const AppPrivate = {
  router
};

class App {
  constructor(option = {}) {
    this.listening = false;

    option.cwd = option.cwd || process.cwd();

    // 初始化
    AppPrivate.option = option;
    AppPrivate.app = new Koa();

    plugins.config(AppPrivate);

    plugins.error(AppPrivate);

    AppPrivate.app.on('error', errorHandler(this));

    AppPrivate.app.use(middlewares.errorHandler(this));

    // 载入必要插件
    plugins.db.all(AppPrivate);

    plugins.logger(AppPrivate);

    // 载入必要中间件
    AppPrivate.app.use(middlewares.healthCheck(this));

    AppPrivate.app.use(AppPrivate.logger.accessMiddleware());

    AppPrivate.app.use(async (ctx, next) => {
      Object.defineProperties(ctx, {
        App: {
          value: this
        },
        middleware: {
          value: this.middleware
        }
      });
      await next();
    });

    AppPrivate.app.use(middlewares.response(this));

    AppPrivate.app.use(middlewares.cors(this));

    AppPrivate.app.use(middlewares.auth(this));

    AppPrivate.app.use(middlewares.bodyParser(this));

    AppPrivate.app.use(middlewares.headers(this));

    plugins.fetch(AppPrivate);

    // 全局挂载项目定制
    plugins.middleware(AppPrivate);
    plugins.plugin(AppPrivate);
    plugins.service(AppPrivate);
    plugins.controller(AppPrivate);
    plugins.router(AppPrivate);

    plugins.mq(AppPrivate);
  }

  get load() {
    return {
      plugin: (plugin) => {
        if (this.listening) {
          throw new Error('cannot load plugin after listening');
        }
        return plugin.call(this);
      },
      middleware: (middleware) => {
        if (this.listening) {
          throw new Error('cannot load middleware after listening');
        }
        return AppPrivate.app.use(middleware(this));
      }
    };
  }

  //noinspection JSMethodCanBeStatic,JSMethodCanBeStatic
  get config() {
    return AppPrivate.config;
  }

  //noinspection JSMethodCanBeStatic,JSMethodCanBeStatic
  get option() {
    return AppPrivate.option;
  }

  //noinspection JSMethodCanBeStatic,JSMethodCanBeStatic
  get plugin() {
    return AppPrivate.plugin;
  }

  //noinspection JSMethodCanBeStatic,JSMethodCanBeStatic
  get middleware() {
    return AppPrivate.middleware;
  }

  //noinspection JSMethodCanBeStatic,JSMethodCanBeStatic
  get service() {
    return AppPrivate.service;
  }

  //noinspection JSMethodCanBeStatic,JSMethodCanBeStatic
  get controller() {
    return AppPrivate.controller;
  }

  //noinspection JSMethodCanBeStatic,JSMethodCanBeStatic
  get Error() {
    return AppPrivate.Error;
  }

  //noinspection JSMethodCanBeStatic,JSMethodCanBeStatic
  get Errors() {
    return AppPrivate.Errors;
  }

  //noinspection JSMethodCanBeStatic,JSMethodCanBeStatic
  get logger() {
    return AppPrivate.logger;
  }

  //noinspection JSMethodCanBeStatic,JSMethodCanBeStatic
  get fetch() {
    return AppPrivate.fetch;
  }

  //noinspection JSMethodCanBeStatic,JSMethodCanBeStatic
  get db() {
    return AppPrivate.db;
  }

  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  get search() {
    return AppPrivate.search;
  }

  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  get redis() {
    return AppPrivate.redis;
  }

  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  get mq() {
    return AppPrivate.mq;
  }

  //noinspection JSMethodCanBeStatic,JSMethodCanBeStatic
  get router() {
    return AppPrivate.router;
  }

  //noinspection JSMethodCanBeStatic,JSMethodCanBeStatic
  get app() {
    return AppPrivate.app;
  }

  listen(port = AppPrivate.config.PORT || 3000) {
    router.all('*', async (ctx) => {
      ctx.throw(404);
    });

    AppPrivate.app.use(router.routes()).use(router.allowedMethods({ throw: true }));

    const server = http.createServer(AppPrivate.app.callback());

    return new Promise((rec, rej) => {
      server.listen(port, () => {
        this.listening = server.listening;
        if (server.listening) {
          AppPrivate.logger.app.info(`server start listening at ${port}`);
          rec(true);
        } else {
          AppPrivate.logger.app.error(`server start listening failed`);
          rej(false);
        }
      });
    });
  }
}

module.exports = App;
