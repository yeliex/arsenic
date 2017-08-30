module.exports = (app) => async (ctx, next) => {
  const XUserPassword = ctx.get('x-user-password');

  if (XUserPassword !== app.config.X_USER_PASSWORD) {
    ctx.throw(401);
    return;
  }

  ctx._USER = Object.assign({}, ctx._USER || {}, {
    userId: Number(ctx.get('X-User-UserId')),
    companyId: Number(ctx.get('X-User-CompanyId'))
  });

  await next();
};
