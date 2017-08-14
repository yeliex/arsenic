/**
 * Controllers Middlweare
 * read controllers and mount
 */

const { resolve } = require('path');
const { existsSync, dirExistsSync } = require('../../libs/utils/fs/index');
const requireContext = require('../../libs/utils/require_context/index');

module.exports = ({ cwd }) => {
  const path = resolve(cwd, './controller');

  if (!dirExistsSync(path)) {
    console.warn(`Controllers not exist: ${path}`);
    return async (ctx, next) => {
      ctx.controller = {};
      await next();
    };
  }

  const controllers = requireContext('./*', {
    cwd: path,
    exclude: /\.js$/
  });

  const keys = Object.keys(controllers);

  if (keys.length < 1) {
    console.warn(`Controllers not exist: ${path}`);
  }

  return async (ctx, next) => {
    ctx.Controller = keys.reduce((total, key) => {
      total[key] = new controllers[key](ctx);
      return total;
    }, {});

    await next();
  };
};
