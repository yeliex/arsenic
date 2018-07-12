module.exports = {
  start: async (ctx, next) => {
    ctx.requestTime = Date.now();
    await next();
  },
  end: (ctx) => {
    ctx.responseTime = Date.now();
  }
};
