const { resolve } = require('path');

module.exports = require('../libs/utils/require-context/index')('./*', {
  cwd: resolve(__dirname, './'),
  exclude: /\.js$/
});
