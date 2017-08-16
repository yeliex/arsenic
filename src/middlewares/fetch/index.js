const fetch = require('../../libs/request');

const headersToObject = (headers) => {
  if (!(headers instanceof Headers)) {
    return headers;
  }
  return Array.from(headers.keys()).reduce((total, key) => {
    total[key] = headers.get(key);
    return total;
  }, {});
};

module.exports = () => async (ctx, next) => {
  let index = 1;

  const headers = headersToObject(ctx._HEADERS || {});

  const traceId = ctx.get('X-System-TraceId');
  const rpcId = ctx.get('X-System-RpcId');

  ctx.fetch = (url, options = {}) => {
    options.headers = {
      ...headers,
      ...headersToObject(options.headers || {}),
      'X-System-RpcId': `${rpcId}.${index++}`
    };
    return fetch(url, options);
  };

  await next(ctx);
};
