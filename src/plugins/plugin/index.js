/**
 * Controllers Middlweare
 * read controllers and mount
 */

const { resolve } = require('path');
const { existsSync, dirExistsSync } = require('../../libs/utils/fs/index');
const requireContext = require('../../libs/utils/require_context/index');

module.exports = (App) => {
  const cwd = App.option.cwd;
  const path = resolve(cwd, './plugins');

  if (!dirExistsSync(path)) {
    return async (ctx, next) => {
      ctx.plugins = {};
      await next();
    };
  }

  const plugins = requireContext('./*', {
    cwd: path,
    exclude: /\.js$/
  });

  const keys = Object.keys(plugins);

  App.plugin = keys.reduce((total, key) => {
    total[key] = plugins[key];
  }, {});
};
