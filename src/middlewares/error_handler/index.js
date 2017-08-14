const errorHandler = require('../../libs/error_handler');

module.exports = () => async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.log(error);
    errorHandler(ctx, error);
  }
};
