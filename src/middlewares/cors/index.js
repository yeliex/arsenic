module.exports = () => async (ctx, next) => {
  if (ctx.method.toUpperCase() === 'OPTIONS') {
    ctx.throw(200, '', false);
    return;
  }
  await next();
};
