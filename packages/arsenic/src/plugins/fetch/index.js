const fetch = require('../../libs/request/index');

module.exports = (App) => {
  App.fetch = fetch;
};
