const { resolve } = require('path');
const mount = require('koa-mount');
const { existsSync, dirExistsSync } = require('../../libs/utils/fs');
const requireContext = require('../../libs/utils/require-context');

module.exports = ({ cwd }) => {
  const path = resolve(cwd, './routers');

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

  return keys.map((key) => {
    if (!routers[key].middleware || typeof routers[key].middleware !== 'function') {
      throw new Error(`router middleware must be a function: ${key}`);
    }
    return mount(`/api/${key}`, routers[key].middleware());
  });
};
