/**
 * Controllers Middlweare
 * read controllers and mount
 */

const { resolve } = require('path');
const { existsSync, dirExistsSync } = require('../../libs/utils/fs/index');
const requireContext = require('../../libs/utils/require_context/index');

const total = {};

const regist = ({ cwd }) => {
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

  keys.forEach((key) => {
    total[key] = middlewares[key];
  });
};

Object.defineProperties(total, {
  regist: {
    value: regist
  }
});

module.exports = total;
