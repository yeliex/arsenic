/**
 *
 * @file index
 * @author: yeliex
 * @create: 2017/8/24 下午2:42
 */
const Redis = require('redis');
const {promisifyAll} = require('bluebird');

module.exports = (App, define) => {
  const config = App.config.plugins.redis;

  if (!config || !config.enable) {
    App.cache = {};
    return;
  }

  const client = Redis.createClient({
    host: config.host,
    port: config.port,
    db: config.db,
    password: config.auth || config.passwd || config.password
  });

  client.on('ready', () => {
    console.log(`[Redis] connected`);
  });

  promisifyAll(Redis.RedisClient.prototype);
  promisifyAll(Redis.Multi.prototype);

  client.on('error', (err) => {
    App.logger.app.error(`[Redis] ${err}`);
  });

  client.on('warning', (warning) => {
    App.logger.app.warn(`[Redis] ${warning}`);
  });

  App.redis = client;
};
