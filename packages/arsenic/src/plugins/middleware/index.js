/**
 * Controllers Middlweare
 * read controllers and mount
 */

const { resolve } = require('path');
const { existsSync, dirExistsSync } = require('../../libs/utils/fs/index');
const requireContext = require('../../libs/utils/require_context/index');

module.exports = (App) => {
  const cwd = App.option.cwd;
  const path = resolve(cwd, './middleware');

  if (!dirExistsSync(path)) {
    return async (ctx, next) => {
      ctx.middleware = {};
      await next();
    };
  }

  const middlewares = requireContext('./*', {
    cwd: path,
    exclude: /\.js$/
  });

  const keys = Object.keys(middlewares);

  App.middleware = keys.reduce((total, key) => {
    total[key] = middlewares[key];

    return total;
  }, {});
};
