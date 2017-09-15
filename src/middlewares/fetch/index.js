const fetch = require('../../libs/request');

const headersToObject = (headers) => {
  if (!(headers instanceof Headers)) {
    return headers;
  }
  return Array.from(headers.keys()).reduce((total, key) => {
    total[key.toLowerCase()] = headers.get(key);
    return total;
  }, {});
};

module.exports = (app) => async (ctx, next) => {
  let index = 1;

  const headers = headersToObject(ctx._HEADERS || {});

  const traceId = ctx._HEADERS.get('X-System-TraceId');
  const rpcId = ctx._HEADERS.get('X-System-RpcId');

  ctx.fetch = (url, options = {}) => {
    options.headers = {
      ...headers,
      ...headersToObject(options.headers || {}),
      'x-system-rpcid': `${rpcId}.${index++}`
    };
    return app.fetch(url, options);
  };

  await next(ctx);
};
