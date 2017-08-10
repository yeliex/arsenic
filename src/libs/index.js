const { resolve } = require('path');

module.exports = require('./utils/require-context/index')('./*', {
  cwd: resolve(__dirname, './'),
  exclude: /\.js$/
});
