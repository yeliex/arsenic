/**
 *
 * @file index
 * @author: yeliex
 * @create: 2017/8/24 下午2:42
 */
const Redis = require('redis');
const { promisify } = require('@bee/foundation');

module.exports = (App, define) => {
  const config = App.config.plugins.redis;

  if (!config || !config.enable) {
    App.cache = {};
    return;
  }

  const client = Redis.createClient({
    host: config.host,
    port: config.port
  });

  client.on('ready', () => {
    if (config.passwd) {
      client.auth(config.passwd, (...res) => {
        console.log(`[Redis auth] ${res}`);
      });
    }
  });

  promisify(Redis.RedisClient.prototype);

  client.on('error', (err) => {
    App.logger.app.error(`[Redis] ${err}`);
  });

  client.on('warning', (warning) => {
    App.logger.app.warn(`[Redis] ${warning}`);
  });

  App.redis = client;
};
