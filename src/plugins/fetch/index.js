const fetch = require('../../libs/request');
const middleware = require('../../middlewares/fetch');

module.exports = (App) => {
  App.fetch = fetch;

  App.app.use(middleware());
};
