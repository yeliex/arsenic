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

  const XUserPassword = ctx.get('x-user-password');
  const userId = ctx.get('x-user-userid');

  if (auth && (!XUserPassword || (XUserPassword !== ctx.App.config.X_USER_PASSWORD))) {
    ctx.throw(401);
    return;
  }

  if (userId) {
    ctx._USER = Object.assign({}, ctx._USER || {}, {
      userId: Number(ctx.get('X-User-UserId')),
      companyId: Number(ctx.get('X-User-CompanyId'))
    });
  } else {
    ctx._USER = {
      userId: 1,
      companyId: 1,
      mock: true
    };
  }

  await next();
};
