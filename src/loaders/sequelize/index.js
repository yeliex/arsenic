const Sequelize = require('sequelize');
const _ = {
  camelCase: require('lodash/camelCase')
};

const fundation = require('./public');

const dbs = {};

module.exports = (config) => {
  const middleware = () => async (ctx, next) => {
    ctx.db = dbs;

    await next();
  };

  if (!config.sequelize) {
    return { middleware };
  }

  const { MYSQL_DB_NAME, MYSQL_DB_HOST = 'localhost', MYSQL_DB_PORT = 3306, MYSQL_DB_USER, MYSQL_DB_PASSWD } = config;

  Object.keys({ MYSQL_DB_NAME, MYSQL_DB_USER, MYSQL_DB_PASSWD }).forEach((k) => {
    if (!config[k]) {
      throw new Error(`${k} cannot be undefined`);
    }
  });

  const sequelize = new Sequelize(MYSQL_DB_NAME, MYSQL_DB_USER, MYSQL_DB_PASSWD, {
    host: MYSQL_DB_HOST,
    port: MYSQL_DB_PORT,
    dialect: 'mysql',
    typeValidation: true,
    benchmark: true,
    define: {
      underscored: true,
      underscoredAll: true
    }
  });

  sequelize.authenticate().then(() => {
    console.info(`connect mysql db: ${MYSQL_DB_NAME} success`);
  }).catch((e) => {
    console.error(`connect mysql db: ${MYSQL_DB_NAME} failed, ${e}`);
  });

  const define = sequelize.define;
  sequelize.define = (arga, argb, argc) => {
    return define.call(sequelize, arga, fundation.model(argb), fundation.option(argc));
  };

  const models = config.sequelize(sequelize);

  Object.keys(models).forEach((key) => {
    const name = `${_.camelCase(key)}`;
    console.log(`connect mysql model ${key} as ${name} success`);
    if (dbs[name]) {
      throw new Error(`duplicate model name ${key}`);
    }
    dbs[name] = models[key];
  });

  sequelize.sync({ force: false }).then(() => {
    console.info(`sync mysql db: ${MYSQL_DB_NAME} success`);
  }).catch((e) => {
    console.error(`sync mysql db: ${MYSQL_DB_NAME} failed, ${e}`);
  });

  Object.defineProperties(dbs, {
    middleware: {
      value: middleware
    }
  });

  return dbs;
};
