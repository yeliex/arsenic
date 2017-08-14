/**
 * Controllers Middlweare
 * read controllers and mount
 */

const { resolve } = require('path');
const { existsSync, dirExistsSync } = require('../../libs/utils/fs/index');
const requireContext = require('../../libs/utils/require_context/index');

module.exports = ({ cwd }) => {
  const path = resolve(cwd, './service');

  if (!dirExistsSync(path)) {
    console.warn(`Services not exist: ${path}`);
    return async (ctx, next) => {
      ctx.Service = {};
      await next();
    };
  }

  const services = requireContext('./*', {
    cwd: path,
    exclude: /\.js$/
  });

  const keys = Object.keys(services);

  if (keys.length < 1) {
    console.warn(`Services not exist: ${path}`);
  }

  return async (ctx, next) => {
    ctx.Service = keys.reduce((total, key) => {
      const service = services[key];
      if (typeof service === 'function') {
        total[key] = new service(ctx);
      } else {
        total[key] = service;
      }
      return total;
    }, {});

    await next();
  };
};
