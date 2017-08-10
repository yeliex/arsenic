const { resolve } = require('path');
const { existsSync, dirExistsSync } = require('../../libs/utils/fs');
const requireContext = require('../../libs/utils/require-context');

module.exports = ({ cwd }) => {
  const path = resolve(cwd, './controllers');

  if (!dirExistsSync(path)) {
    console.warn(`Controllers not exist: ${path}`);
    return async (ctx, next) => {
      ctx.controller = {};
      await next();
    };
  }

  const controllers = requireContext('*.js', {
    cwd: path
  });

  const keys = Object.keys(controllers);

  if (keys.length < 1) {
    console.warn(`Controllers not exist: ${path}`);
  }

  return async (ctx, next) => {
    ctx.controller = keys.reduce((total, key) => {
      total[key] = new controllers[key](ctx);
      return total;
    }, {});

    await next();
  };
};
