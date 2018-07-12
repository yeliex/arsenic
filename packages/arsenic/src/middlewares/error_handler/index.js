const errorHandler = require('../../libs/error_handler/index');

module.exports = (app) => async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    errorHandler(app)(error, ctx);
  }
};
