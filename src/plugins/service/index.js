/**
 * Controllers Middlweare
 * read services and mount
 */

const { resolve, basename } = require('path');
const glob = require('glob');
const fs = require('fs');
const { existsSync, dirExistsSync } = require('../../libs/utils/fs/index');
const requireRecursion = require('../../libs/utils/require_recursion');
const _ = {
  camelCase: require('lodash/camelCase')
};

module.exports = (App) => {
  const cwd = App.option.cwd;
  const path = resolve(cwd, './service');

  if (!dirExistsSync(path)) {
    console.warn(`Services not exist: ${path}`);
    return async (ctx, next) => {
      ctx.service = {};
      await next();
    };
  }

  const services = requireRecursion({
    cwd: path,
    require: (path) => {
      const model = require(path);

      if (typeof model === 'function') {
        return new model(App);
      }
      return model;
    }
  });

  const recursionInit = (obj, ctx) => {
    if (typeof obj !== 'object') {
      return obj;
    }
    const total = obj.index ? (typeof obj.index === 'function' ? new obj.index(ctx) : recursionInit(obj.index, ctx)) : {};

    const properties = Object.keys(obj).filter(k => k !== 'index').reduce((props, key) => {
      const method = obj[key];

      props[key] = {
        value: typeof method === 'function' ? new method(ctx) : recursionInit(method, ctx)
      };

      return props;
    }, {});

    Object.defineProperties(total, properties);

    return total;
  };

  const middleware = async (ctx, next) => {
    ctx.service = recursionInit(services, ctx);
    await next();
  };

  App.app.use(middleware);
};
