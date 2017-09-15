class Context {
  constructor(ctx) {
    this.ctx = ctx;
  }

  get app() {
    return this.ctx.App;
  }

  get Error() {
    return this.ctx.App.Error;
  }

  get Errors() {
    return this.ctx.App.Errors;
  }

  get controller() {
    return this.ctx.controller;
  }

  get service() {
    return this.ctx.service;
  }

  get middleware() {
    return this.ctx.App.middleware;
  }

  get plugin() {
    return this.ctx.App.plugin;
  }

  get logger() {
    return this.ctx.App.logger;
  }

  get throw() {
    return this.ctx.throw;
  }

  get throwBody() {
    return this.ctx.throwBody;
  }

  get fetch() {
    return this.ctx.fetch;
  }

  get config() {
    return this.ctx.App.config;
  }

  get db() {
    return this.ctx.App.db;
  }

  get search() {
    return this.ctx.App.search;
  }

  get cache() {
    return this.ctx.App.redis;
  }

  get redis() {
    return this.cache;
  }

  get mq() {
    return this.ctx.App.mq;
  }

  get user() {
    return this.ctx._USER;
  }

  get headers() {
    return this.ctx._HEADERS;
  }

  get query() {
    return this.ctx._GET;
  }

  get body() {
    return this.ctx._POST;
  }

  get params() {
    return this.ctx.params;
  }
}

module.exports = Context;
