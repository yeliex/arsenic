const errorHandler = require('../../libs/errorHandler');

module.exports = () => async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    errorHandler(ctx, error);
  }
};
