const authMiddleware = require('../../middlewares/auth');

module.exports = function optionsToMiddlewares(options) {
  Object.keys(options).reduce((middlewares, option) => {
    switch (option) {
      case 'auth': {
        middlewares.push(authMiddleware(option));
        break;
      }

      default: {
        break;
      }
    }

    return middlewares;
  }, options.auth ? [] : [authMiddleware()]);
};
