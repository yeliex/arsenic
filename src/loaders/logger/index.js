const log4js = require('koa-log4');
const { resolve } = require('path');
const { mkdirSync } = require('fs');
const globalConfig = require('./config');
const _ = require('lodash');

const loggers = {};

const regist = (config) => {
  config.logger = config.logger || {};

  const loggerConfig = {
    appenders: [].concat(globalConfig.appenders, config.logger.appenders || []),
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

  loggerConfig.appenders = loggerConfig.appenders.map((appender) => {
    if(appender.category) {
      appender.filename = resolve(logPath, `${appender.category}.log`);
    }
    return appender;
  });

  log4js.configure(loggerConfig);

  loggerConfig.appenders.filter(({ category }) => !!category).forEach(({ category }) => {
    loggers[_.camelCase(category)] = log4js.getLogger(category);
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

const accessMiddleware = () => log4js.koaLogger(loggers.accessApi, {
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

module.exports = loggers;
