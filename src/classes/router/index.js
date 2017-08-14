const KoaRouter = require('koa-router');
const { join } = require('path');

module.exports = function Router({ prefix: routePrefix, ...options }) {
  const that = new KoaRouter(options);

  that.prefix = routePrefix;

  that.mount = (prefix, getController) => {
    if (typeof getController !== 'function') {
      throw new Error(`getController must be function: ${prefix}`);
    }
    const prefixWithId = join(prefix, ':id');

    // GET /prefix
    that.get(prefix, (ctx) => {
      if (typeof getController(ctx).list === 'function') {
        return getController(ctx).list();
      }
      ctx.throw();
    });

    // POST /prefix
    that.post(prefix, (ctx) => {
      if (typeof getController(ctx).create === 'function') {
        return getController(ctx).create();
      }
      ctx.throw();
    });

    // GET /prefix/:id
    that.get(prefixWithId, (ctx) => {
      if (typeof getController(ctx).item === 'function') {
        return getController(ctx).item();
      }
      ctx.throw();
    });

    // PUT /prefix/:id
    that.put(prefixWithId, (ctx) => {
      if (typeof getController(ctx).update === 'function') {
        return getController(ctx).update();
      }
      ctx.throw();
    });

    // DELETE /prefix/:id
    that.delete(prefixWithId, (ctx) => {
      if (typeof getController(ctx).destroy === 'function') {
        return getController(ctx).destroy();
      }
      ctx.throw();
    });
  };

  return that;
};
