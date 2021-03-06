const { resolve } = require('path');
const minimist = require('minimist');
const { existsSync, dirExistsSync } = require('../../libs/utils/fs/index');
const requireContext = require('../../libs/utils/require_context/index');
const extend = require('extend2');

const args = Object.assign({}, minimist(process.argv), minimist(JSON.parse(process.env.npm_config_argv || '{}').original || ''));

const env = (() => {
  if (args.daily) {
    return 'daily';
  }
  if (args.dev || args.development) {
    return 'development';
  }
  if (args.prod || args.production || args.online) {
    return 'production';
  }
  if (args.env) {
    return args.env;
  }
  if (process.env.NODE_ENV) {
    return process.env.NODE_ENV;
  }
  return 'development';
})();

module.exports = (app) => {
  const cwd = app.option.cwd || process.cwd();

  const path = resolve(cwd, './config');

  if (!dirExistsSync(path)) {
    throw new Error(`Configs not exist: ${path}`);
  }

  const contexts = requireContext('./config.*.js', {
    cwd: path
  });

  const baseConfig = contexts.configBase || {};

  const configs = Object.keys(contexts).reduce((total, key) => {
    const name = key.replace(/^config/, '').toLowerCase();

    switch (name) {
      case 'prod': {
        total['production'] = contexts[key];
        break;
      }
      case 'dev': {
        total['development'] = contexts[key];
        break;
      }
      default: {
        total[name] = contexts[key];
      }
    }

    return total;
  }, {});

  configs.default = configs.default || {};

  const current = configs[env] || configs.default;

  const config = extend(true, {}, baseConfig, current);
  config.plugins = config.plugins || {};

  if (typeof config !== 'object') {
    throw new Error('config must be object');
  }

  config.cwd = cwd;

  const middleware = () => async (ctx, next) => {
    ctx.config = config;
    await next();
  };

  Object.defineProperties(config, {
    middleware: {
      value: middleware
    }
  });

  process.env.NODE_ENV = env;

  app.config = config;

  return config;
};
