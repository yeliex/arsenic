/**
 *
 * @file index
 * @author: yeliex
 * @create: 2017/8/24 下午2:42
 */
module.exports = (App, define) => {
  const config = App.config.plugins.redis;

  if (!config || !config.enable) {
    App.cache = {};
    return;
  }
};
