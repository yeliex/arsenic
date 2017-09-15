const { resolve } = require('path');

module.exports = require('../libs/utils/require_context/index')('./*', {
  cwd: resolve(__dirname, './'),
  exclude: /\.js$/
});
