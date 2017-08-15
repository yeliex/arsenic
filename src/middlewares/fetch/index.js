const fetch = require('../../libs/request');

module.exports = () => async (ctx, next) => {
  let index = 1;

  const headers = ctx._HEADERS || {};

  const traceId = ctx.get('X-System-TraceId');
  const rpcId = ctx.get('X-System-RpcId');

  ctx.fetch = (url, options = {}) => {
    options.headers = {
      ...(options.headers || {}),
      ...headers,
      'X-System-RpcId': `${rpcId}.${index++}`
    };
    return fetch(url, options);
  };

  await next(ctx);
};
