const Router = require('koa-router');
const Layer = require('koa-router/lib/layer');
const methods = require('methods');
const { join } = require('path');
const compose = require('koa-compose');
const optionsToMiddlewares = require('./optionsToMiddlewares');

/**
 * @name get|put|post|patch|delete|del
 * @memberOf module:koa-router.prototype
 * @param {String} name
 * @param {String} path
 * @param {Object} options
 * @param {Function=} middleware route middleware(s)
 * @param {Function} callback route callback
 * @returns {Router}
 */
methods.forEach(function(method) {
  Router.prototype[method] = function() {
    const args = Array.prototype.map.call(arguments, a => a);
    let name, options;
    if (typeof args[1] === 'string' || args[1] instanceof RegExp) {
      name = args.splice(0, 1);
    } else {
      name = null;
    }

    const path = args.splice(0, 1);

    if (typeof args[0] !== 'function') {
      options = args.splice(0, 1);
    }

    this.register(path, [method], args, Object.assign({}, options || {}, {
      name
    }));

    return this;
  };
});

Router.prototype.register = function(path, methods, middleware, opts = {}) {
  if (Array.isArray(path)) {
    path.forEach(function(each) {
      router.register.call(this, each, methods, middleware, opts);
    });

    return this;
  }

  const route = new Layer(path, methods, [].concat(optionsToMiddlewares(opts), middleware), {
    end: opts.end === false ? opts.end : true,
    name: opts.name,
    sensitive: opts.sensitive || this.opts.sensitive || false,
    strict: opts.strict || this.opts.strict || false,
    prefix: opts.prefix || this.opts.prefix || '',
    ignoreCaptures: opts.ignoreCaptures
  });

  if (this.opts.prefix) {
    route.setPrefix(this.opts.prefix);
  }

  // add parameter middleware
  Object.keys(this.params).forEach(function(param) {
    route.param(param, this.params[param]);
  }, this);

  this.stack.push(route);

  return route;
};

Router.prototype.mount = function(prefix, opts, getController) {
  if(opts && !getController && typeof opts === 'function'){
    getController = opts;
    opts = {};
  }

  if (typeof getController !== 'function') {
    throw new Error(`getController must be function: ${prefix}`);
  }
  const prefixWithId = join(prefix, ':id');

  // GET /prefix
  this.get(prefix, opts, (ctx) => {
    if (typeof getController(ctx).list === 'function') {
      return getController(ctx).list();
    }
    ctx.throw();
  });

  // POST /prefix
  this.post(prefix, opts, (ctx) => {
    if (typeof getController(ctx).create === 'function') {
      return getController(ctx).create();
    }
    ctx.throw();
  });

  // GET /prefix/:id
  this.get(prefixWithId, opts, (ctx) => {
    if (typeof getController(ctx).item === 'function') {
      return getController(ctx).item();
    }
    ctx.throw();
  });

  // PUT /prefix/:id
  this.put(prefixWithId, opts, (ctx) => {
    if (typeof getController(ctx).update === 'function') {
      return getController(ctx).update();
    }
    ctx.throw();
  });

  // DELETE /prefix/:id
  this.delete(prefixWithId, opts, (ctx) => {
    if (typeof getController(ctx).destroy === 'function') {
      return getController(ctx).destroy();
    }
    ctx.throw();
  });
};

module.exports = Router;
