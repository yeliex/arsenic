module.exports = (auth) => async (ctx, next) => {
  if (ctx.App.config.noauth === true && auth === true) {
    auth = true;
  }

  if (!ctx.App.config.noauth && auth === false) {
    auth = false;
  }

  if (auth === undefined) {
    auth = !ctx.App.config.noauth;
  }

  // todo: 在这里处理无需校验的情况下获取的用户信息

  if (!auth) {
    ctx._USER = {
      userId: 1,
      companyId: 1,
      mock: true
    };
    await next();
    return;
  }

  const XUserPassword = ctx.get('x-user-password');

  if (ctx.App.config.X_USER_PASSWORD && (XUserPassword !== ctx.App.config.X_USER_PASSWORD)) {
    ctx.throw(401);
    return;
  }

  ctx._USER = Object.assign({}, ctx._USER || {}, {
    userId: Number(ctx.get('X-User-UserId')),
    companyId: Number(ctx.get('X-User-CompanyId'))
  });

  await next();
};
