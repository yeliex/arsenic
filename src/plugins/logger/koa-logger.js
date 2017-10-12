/* eslint-disable no-underscore-dangle */
const levels = require('log4js').levels;

const DEFAULT_FORMAT = ':remote-addr - -' +
  ' ":method :url HTTP/:http-version"' +
  ' :status :content-length ":referrer"' +
  ' ":user-agent"';

const createNoLogCondition = (nolog) => {
  let regexp = null;
  if (nolog) {
    if (nolog instanceof RegExp) {
      regexp = nolog;
    }

    if (typeof nolog === 'string') {
      regexp = new RegExp(nolog);
    }

    if (Array.isArray(nolog)) {
      const regexpsAsStrings = nolog.map((o) => (o.source ? o.source : o));
      regexp = new RegExp(regexpsAsStrings.join('|'));
    }
  }

  return regexp;
};

const assembleTokens = (ctx, customTokens) => {
  const arrayUniqueTokens = function(array) {
    const a = array.concat();
    for (let i = 0; i < a.length; ++i) {
      for (let j = i + 1; j < a.length; ++j) {
        // eslint-disable-next-line eqeqeq
        if (a[i].token == a[j].token) { // not === because token can be regexp object
          a.splice(j--, 1);
        }
      }
    }
    return a;
  };
  const defaultTokens = [];
  defaultTokens.push({ token: ':url', replacement: ctx.originalUrl });
  defaultTokens.push({ token: ':protocol', replacement: ctx.protocol });
  defaultTokens.push({ token: ':hostname', replacement: ctx.hostname });
  defaultTokens.push({ token: ':method', replacement: ctx.method });
  defaultTokens.push({
    token: ':status',
    replacement: ctx.response.status || ctx.response.__statusCode || ctx.res.statusCode
  });
  defaultTokens.push({ token: ':response-time', replacement: ctx.response.responseTime });
  defaultTokens.push({ token: ':date', replacement: new Date().toUTCString() });
  defaultTokens.push({ token: ':referrer', replacement: ctx.headers.referer || '' });
  defaultTokens.push({
    token: ':http-version',
    replacement: `${ctx.req.httpVersionMajor }.${ ctx.req.httpVersionMinor}`
  });
  defaultTokens.push({
    token: ':remote-addr',
    replacement: ctx.headers['x-forwarded-for'] || ctx.ip || ctx.ips ||
    (ctx.socket && (ctx.socket.remoteAddress || (ctx.socket.socket && ctx.socket.socket.remoteAddress)))
  });
  defaultTokens.push({ token: ':user-agent', replacement: ctx.headers['user-agent'] });
  defaultTokens.push({
    token: ':content-length',
    replacement: (ctx.response._headers && ctx.response._headers['content-length']) ||
    (ctx.response.__headers && ctx.response.__headers['Content-Length']) ||
    ctx.response.length || '-'
  });
  defaultTokens.push({
    token: /:req\[([^\]]+)\]/g,
    replacement: function(_, field) {
      return ctx.headers[field.toLowerCase()];
    }
  });
  defaultTokens.push({
    token: /:res\[([^\]]+)\]/g,
    replacement: function(_, field) {
      return ctx.response._headers
        ? (ctx.response._headers[field.toLowerCase()] || ctx.response.__headers[field])
        : (ctx.response.__headers && ctx.response.__headers[field]);
    }
  });

  customTokens = customTokens.map(function(token) {
    if (token.content && typeof token.content === 'function') {
      token.replacement = token.content(ctx);
    }
    return token;
  });

  return arrayUniqueTokens(customTokens.concat(defaultTokens));
};

const format = (str, tokens) => {
  for (let i = 0; i < tokens.length; i++) {
    str = str.replace(tokens[i].token, tokens[i].replacement);
  }
  return str;
};

const getKoaLogger = (logger4js, options) => {
  if (typeof options === 'object') {
    options = options || {};
  } else if (options) {
    options = { format: options };
  } else {
    options = {};
  }

  const thislogger = logger4js;
  let level = levels.getLevel(options.level, levels.INFO);

  const fmt = options.format || DEFAULT_FORMAT;
  const nolog = options.nolog ? createNoLogCondition(options.nolog) : null;

  return async (ctx, next) => {
    // mount safety
    if (ctx.request._logging) return await next();

    // nologs
    if (nolog && nolog.test(ctx.originalUrl)) return await next();
    if (thislogger.isLevelEnabled(level) || options.level === 'auto') {
      const start = new Date();
      const writeHead = ctx.response.writeHead;

      // flag as logging
      ctx.request._logging = true;

      // proxy for statusCode.
      ctx.response.writeHead = function(code, headers) {
        ctx.response.writeHead = writeHead;
        ctx.response.writeHead(code, headers);
        ctx.response.__statusCode = code;
        ctx.response.__headers = headers || {};

        // status code response level handling
        if (options.level === 'auto') {
          level = levels.INFO;
          if (code >= 300) level = levels.WARN;
          if (code >= 400) level = levels.ERROR;
        } else {
          level = levels.toLevel(options.level, levels.INFO);
        }
      };

      await next();
      // hook on end request to emit the log entry of the HTTP request.
      ctx.response.responseTime = new Date() - start;
      // status code response level handling
      if (ctx.res.statusCode && options.level === 'auto') {
        level = levels.INFO;
        if (ctx.res.statusCode >= 300) level = levels.WARN;
        if (ctx.res.statusCode >= 400) level = levels.ERROR;
      }
      if (thislogger.isLevelEnabled(level)) {
        const combinedTokens = assembleTokens(ctx, options.tokens || []);
        if (typeof fmt === 'function') {
          const line = fmt(ctx, function(str) {
            return format(str, combinedTokens);
          });
          if (line) thislogger.log(level, line);
        } else {
          thislogger.log(level, format(fmt, combinedTokens));
        }
      }
    } else {
      // ensure next gets always called
      await next();
    }
  };
};

module.exports = getKoaLogger;
