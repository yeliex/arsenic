/**
 * Router Middleware
 * Read Routers and mount
 */

const { resolve, join } = require('path');
const mount = require('koa-mount');
const { existsSync, dirExistsSync } = require('../../libs/utils/fs/index');
const requireContext = require('../../libs/utils/require_context/index');

module.exports = (App) => {
  const cwd = App.option.cwd;
  const path = resolve(cwd, './router');

  if (!dirExistsSync(path)) {
    console.warn(`Routers not exist: ${path}`);
    return async (ctx, next) => {
      await next();
    };
  }

  const routers = requireContext('*.js', {
    cwd: path
  });

  const keys = Object.keys(routers);

  if (keys.length < 1) {
    console.warn(`Routers not exist: ${path}`);
  }

  keys.forEach((key) => {
    const required = routers[key] || {};
    const router = typeof required === 'function' ? required(App) : required;

    if (!router.middleware || typeof router.middleware !== 'function') {
      throw new Error(`router middleware must be a function: ${key}`);
    }

    App.app.use(mount(join(router.prefix || '/', key === 'index' ? '/' : key), router.middleware()));
  });
};
