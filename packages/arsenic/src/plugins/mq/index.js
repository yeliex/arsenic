const { resolve } = require('path');
const { MQ } = require('@yeliex/arsenic-foundation');

module.exports = (App) => {
  const config = App.config.plugins.mq || {};

  if (!config.enable) {
    App.mq = {};
    return;
  }

  if (config.onsAddr) {
    delete config.namesrvAddr;
  }

  const define = require(resolve(App.config.cwd, './define/mq.define.js'));

  config.logger = config.logger || App.logger.mq;

  App.mq = new MQ(config, define);
};
