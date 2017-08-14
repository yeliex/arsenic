const { resolve } = require('path');

module.exports = require('./utils/require_context/index')('./*', {
  cwd: resolve(__dirname, './'),
  exclude: /\.js$/
});
