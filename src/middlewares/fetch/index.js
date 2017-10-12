const { stringify } = require('qs');
const fetch = require('../../libs/request/fetch');

const headersToObject = (headers) => {
  if (!(headers instanceof Headers)) {
    return headers;
  }
  return Array.from(headers.keys()).reduce((total, key) => {
    total[key.toLowerCase()] = headers.get(key);
    return total;
  }, {});
};

const defaultBaseHost = (path, options) => {
  const host = process.env.NODE_ENV === 'production' ? '117sport.net' : '117sport.org';
  const url = path.replace(/^\/\/([A-Z-_]{1,})/, (a, b) => {
    return `http://service-${b.toLowerCase()}.${host}`;
  });

  if (options.query) {
    return `${url}${url.match(/\?/) ? '&' : '?'}${stringify(options.query)}`;
  }
  return url;
};

module.exports = (app) => {
  if (app.config.baseHost !== false && typeof fetch.baseHost === 'function') {
    fetch.baseHost(app.config.baseHost || defaultBaseHost);
  }

  const callback = ({ data, response }) => {
    const requestId = response.headers.get('x-system-requestid');

    // 输出成功日志
    app.logger.fetch.info(`[response][${response.status}] ${requestId} ${response.url} ${JSON.stringify(data)}`);

    return data;
  };

  const errorHandler = ({ error, response }) => {
    const requestId = response.headers.get('x-system-requestid');

    app.logger.fetch.error(`[response][${response.status}] ${requestId} ${response.url} ${typeof e === 'object' ? JSON.stringify(error) : error}`);

    if (error.code === 'S0-000-00-0002') {
      return Promise.reject(`系统错误: ${error.code}`);
    }

    if (response.status !== 200) {
      return Promise.reject({
        code: response.status,
        msg: error.message || error.msg || error
      });
    }

    return Promise.reject(error.msg || error.message || error);
  };

  return async (ctx, next) => {
    let index = 1;

    const headers = headersToObject(ctx._HEADERS || {});

    const traceId = ctx._HEADERS.get('X-System-TraceId');
    const rpcId = ctx._HEADERS.get('X-System-RpcId');

    ctx.fetch = (url, options = {}) => {
      app.logger.fetch.info(`[${options.method || 'GET'}] ${url} ${options.mock ? 'mock' : ''}`);

      options.headers = {
        ...headers,
        ...headersToObject(options.headers || {}),
        'x-system-rpcid': `${rpcId}.${index++}`
      };
      return fetch(url, options).then(callback).catch(errorHandler);
    };

    await next(ctx);
  };
};
