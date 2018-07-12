module.exports = () => async (ctx, next) => {
  if (['GET'].includes(ctx.method) && ctx.url.match(/\/health/)) {
    ctx.status = 200;
    ctx.body = 'success';
    return;
  }
  await next();
};
