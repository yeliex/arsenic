// 对系统异常的处理,比如未捕获的异常
module.exports = (App) => (error, ctx) => {
  if (!error instanceof App.Error) {

  }
  App.logger.error.error(error);
  const res = {
    code: 500,
    message: ''
  };
  if (error instanceof Error) {
    res.code = 500;
    res.message = error.message;
  } else if (typeof error === 'object') {
    res.code = error.code || 500;
    res.message = error.message || error.error;
    /*
    // if want status 200
    res.code = 200;
    res.message = {
      code: 200,
      message: error.message || error.err
    };
    */
  } else {
    res.code = 500;
    res.message = error;
  }
  if (ctx && typeof ctx.throw === 'function') {
    ctx.throw(res.code, res.message);
  }
};

