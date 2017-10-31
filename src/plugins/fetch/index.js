const fetch = require('../../libs/request');

module.exports = (App) => {
  App.fetch = fetch;
};
