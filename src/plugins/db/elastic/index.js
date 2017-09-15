/**
 *
 * @file index
 * @author: yeliex
 * @create: 2017/8/24 下午2:42
 */
const { Elastic } = require('@bee/foundation');

const _ = {
  camelCase: require('lodash/camelCase')
};

module.exports = (App, define) => {
  const config = App.config.plugins.elastic;

  if (!config || !config.enable) {
    App.search = {};
    return;
  }

  const elastic = new Elastic({
    hosts: config.hosts ? config.hosts : [config.host]
  });

  const models = define(elastic);

  const search = Object.keys(models).reduce((total, key) => {
    total[_.camelCase(key)] = models[key];
    return total;
  }, {});

  App.search = search;

  return search;
};
