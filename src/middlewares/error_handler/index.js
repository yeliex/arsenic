const errorHandler = require('../../libs/error_handler');

module.exports = (app) => async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    errorHandler(app)(error, ctx);
  }
};
