// 对系统异常的处理,比如未捕获的异常
const { Error: BaseError } = require('@bee/foundation');

module.exports = (App) => (error, ctx) => {
  if (error instanceof BaseError) {
    App.logger.error.error(error.toString());
    ctx.throw(error);
    return;
  }

  if (error instanceof Error) {
    App.logger.error.error(error);
    const newError = new BaseError.Errors.UNKNOWN_ERROR();
    newError.message = error.message;
    ctx.throw(newError);
    return;
  }

  if (!Number.isNaN(error.code) && error.code > 200 && error.code < 512) {
    App.logger.error.error(JSON.stringify(error));
    ctx.throw(error.code, error.message);
    return;
  }

  App.logger.error.error(error);
  const newError = new BaseError.Errors.UNKNOWN_ERROR();
  newError.message = error.message || error;
  ctx.throw(newError);
};
