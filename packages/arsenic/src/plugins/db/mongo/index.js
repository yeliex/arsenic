const { Mongo } = require('@yeliex/arsenic-foundation');

const _ = {
  camelCase: require('lodash/camelCase')
};

module.exports = (App, define) => {
  const config = App.config.plugins.mongo;

  if (!config || !config.enable) {
    App.mongo = {};
    return;
  }

  const mongo = new Mongo(config);

  const models = define(mongo);

  const mongos = Object.keys(models).reduce((total, key) => {
    total[_.camelCase(key)] = models[key];
    return total;
  }, {});

  App.mongo = mongos;

  return mongos;
};
