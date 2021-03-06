const Sequelize = require('sequelize');
const _ = {
  camelCase: require('lodash/camelCase')
};

const fundation = require('./public');

const dbs = {};

module.exports = (App, define) => {
  const config = App.config.plugins.mysql;

  if (typeof define !== 'function' || !config.enable) {
    App.db = App.db || {};
    return {};
  }

  const { db: name, host = 'localhost', port = 3306, user, passwd } = config;

  Object.keys({ db: name, user, passwd }).forEach((k) => {
    if (!config[k]) {
      throw new Error(`${k} cannot be undefined`);
    }
  });

  const sequelize = new Sequelize(name, user, passwd, {
    host: host,
    port: port,
    dialect: 'mysql',
    dialectOptions: config.options || {},
    typeValidation: true,
    benchmark: true,
    define: {
      underscored: true,
      underscoredAll: true
    },
    ...config.dbOptions
  });

  sequelize.authenticate().then(() => {
    console.info(`connect mysql db: ${name} success`);
  }).catch((e) => {
    console.error(`connect mysql db: ${name} failed, ${e}`);
  });

  const sequelizeDefine = sequelize.define;

  sequelize.define = (arga, argb, argc) => {
    return sequelizeDefine.call(sequelize, arga, fundation.model(argb), fundation.option(argc));
  };

  const models = define(sequelize);

  Object.keys(models).forEach((key) => {
    const name = `${_.camelCase(key)}`;
    console.log(`connect mysql model ${key} as ${name} success`);
    if (dbs[name]) {
      throw new Error(`duplicate model name ${key}`);
    }
    dbs[name] = models[key];
  });

  sequelize.sync({ force: false }).then(() => {
    console.info(`sync mysql db: ${name} success`);
  }).catch((e) => {
    console.error(`sync mysql db: ${name} failed, ${e}`);
  });

  App.sequelize = sequelize;

  App.db = dbs;

  return dbs;
};
