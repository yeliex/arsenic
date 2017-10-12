require('node.date-time');

const { ip } = require('../../libs/utils/os');

module.exports = (app) => {
  return (ctx) => {
    if (process.env.NODE_ENV !== 'test') {
      app.logger.accessApi[ctx.status < 400 ? 'info' : 'error'](`[${ctx.status}][${ctx.method.toUpperCase()}] ${ctx.originalUrl} ${ctx.body}`);
    }

    const logs = [];

    // time
    logs.push(new Date().format('Y-MM-dd HH:mm:SS.ms'));

    // ip
    logs.push(ctx.get('X-Forwarded-For') || ip);

    // requestId
    logs.push(ctx.response.get('X-System-RequestId') || '-');

    // userId
    logs.push((ctx._USER || {}).userId || ctx.get('X-User-UserId') || '-');

    // ua
    logs.push(ctx.get('User-Agent') || '-');

    // path
    logs.push(ctx.originalUrl);

    // httpCode
    logs.push(ctx.response.status);

    // systemCode
    try {
      const res = JSON.parse(ctx.response.body);

      logs.push(res.code);
    } catch (e) {
      logs.push(ctx.response.status);
    }

    // costTime
    logs.push(ctx.responseTime - ctx.requestTime);

    app.logger.request.info(...logs);
  };
};
