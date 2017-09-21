module.exports = (app) => async (ctx, next) => {
  if (app.config.noauth === true) {
    ctx._USER = {
      userId: 1,
      companyId: 1,
      mock: true
    };
    await next();
    return;
  }

  const XUserPassword = ctx.get('x-user-password');

  if (app.config.X_USER_PASSWORD && (XUserPassword !== app.config.X_USER_PASSWORD)) {
    ctx.throw(401);
    return;
  }

  ctx._USER = Object.assign({}, ctx._USER || {}, {
    userId: Number(ctx.get('X-User-UserId')),
    companyId: Number(ctx.get('X-User-CompanyId'))
  });

  await next();
};
