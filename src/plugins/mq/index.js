const { resolve } = require('path');
const { MQ } = require('@bee/foundation');

module.exports = (App) => {
  const config = App.config.plugins.mq || {};

  if (!config.enable) {
    App.mq = {};
    return;
  }

  const define = require(resolve(App.config.cwd, './define/mq.define.js'));

  App.mq = new MQ(config, define);
};
