class Context {
  constructor(ctx) {
    this.ctx = ctx;
  }

  get logger() {
    return this.ctx.logger;
  }

  get controller() {
    return this.ctx.controller;
  }

  get service() {
    return this.ctx.service;
  }

  get db() {
    return this.ctx.db;
  }

  get throw() {
    return this.ctx.throw;
  }

  get fetch() {
    return this.ctx.fetch;
  }

  get config() {
    return this.ctx.config;
  }

  get user() {
    return this.ctx._USER;
  }

  get headers() {
    return this.ctx._HEADERS;
  }
}

module.exports = Context;
