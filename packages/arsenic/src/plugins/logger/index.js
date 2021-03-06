const log4js = require('log4js');
const { resolve } = require('path');
const { mkdirSync } = require('fs');
const globalConfig = require('./config');
const koaLogger = require('./koa-logger');
const _ = require('lodash');

const loggers = {};

const regist = (config) => {
  config.logger = config.logger || {};

  const loggerConfig = {
    appenders: Object.assign({}, globalConfig.appenders, config.logger.appenders || {}),
    replaceConsole: config.logger.replaceConsole || globalConfig.replaceConsole
  };

  const logPath = config.logger.path ? resolve(config.logger.path, 'logs') : resolve(config.cwd, 'logs', config.name || '');

  try {
    mkdirSync(logPath);
  } catch (e) {
    if (!e.message.match(/exists/)) {
      throw new Error(e);
    }
  }

  loggerConfig.categories = loggerConfig.categories || {};

  loggerConfig.appenders = Object.keys(loggerConfig.appenders).reduce((total, key) => {
    const appender = loggerConfig.appenders[key];

    const appenders = [key];

    if (appender.console || (config.logger.console && key !== 'mq')) {
      appenders.push('console');
    }

    if (key === 'console') {
      loggerConfig.categories.default = loggerConfig.categories[key] || {
        appenders,
        level: appender.level || 'all'
      };
    }

    loggerConfig.categories[key] = loggerConfig.categories[key] || {
      appenders,
      level: appender.level || 'info'
    };

    total[key] = {
      ...appender,
      daysToKeep: appender.daysToKeep && appender.daysToKeep !== 0 ? appender.daysToKeep : 7,
      filename: resolve(logPath, `${key}.log`)
    };
    return total;
  }, {});

  log4js.configure(loggerConfig);

  Object.keys(loggerConfig.appenders).forEach((key) => {
    loggers[_.camelCase(key)] = log4js.getLogger(key);
  });

  return loggers;
};

const middleware = () => async (ctx, next) => {
  ctx.logger = loggers;
  await next();
};

// todo: 需要与java端保持一致
const DEFAULT_FORMAT = ':remote-addr - -' +
  ' ":method :url HTTP/:http-version"' +
  ' :status :response-time :content-length ":referrer"' +
  ' ":user-agent" :req[header] :req[Accept]';

const accessMiddleware = () => koaLogger(loggers.accessApi, {
  level: 'auto',
  format: DEFAULT_FORMAT
});

Object.defineProperties(loggers, {
  DEFAULT_FORMAT: {
    value: DEFAULT_FORMAT
  },
  regist: {
    value: regist
  },
  accessMiddleware: {
    value: accessMiddleware
  },
  middleware: {
    value: middleware
  }
});

module.exports = (app) => {
  loggers.regist(app.config);

  app.logger = loggers;

  return loggers;
};
