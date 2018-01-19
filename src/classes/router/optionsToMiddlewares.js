const authMiddleware = require('../../middlewares/auth');

module.exports = function optionsToMiddlewares(options, b) {
  return Object.keys(options).reduce((middlewares, option) => {
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
  }, Object.keys(options).includes('auth') ? [] : [authMiddleware()]);
};
