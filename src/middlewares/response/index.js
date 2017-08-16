'use strict';

const { STATUS_CODES } = require('http');

module.exports = (options = {}) => {
  const { cors = false } = options;

  return async (ctx, next) => {
    //noinspection JSCommentMatchesSignature
    ctx.throw = (...args) => {
      const response = {
        code: 404,
        data: ''
      };

      const opts = args[2] || {};
      opts.json = opts.json !== false;

      switch (Number(args.length)) {
        /**
         * ctx.throw();
         */
        case 0: {
          response.code = 404;
          break;
        }
        /**
         * ctx.throw(403)
         * ctx.throw(new Error('invalid'))
         * ctx.throw('something exploded')
         * ctx.throw({code: 200, data: 'success'})
         */
        case  1: {
          if (!isNaN(Number(args[0]))) {
            response.code = args[0];
            break;
          }
          if (args[0] instanceof Error) {
            response.code = 500;
            response.data = {
              code: args[0].code || args[0].number || 500,
              message: args[0].message
            };
            break;
          }
          if (typeof args[0] === 'object') {
            response.code = args[0].code || 500;
            response.data = {
              code: args[0].code || 500,
              message: args[0].message,
              data: args[0].data
            };
            break;
          }
          response.code = 500;
          response.data = {
            code: 500,
            message: args[0]
          };
          break;
        }
        /**
         * args.length > 2, ignored
         * ctx.throw('name requires', 400);
         * ctx.throw(400, 'name required');
         * ctx.throw(new Error('invalid'), 400)
         * ctx.throw(400, new Error('invalid'))
         * ctx.throw(200, any)
         * ctx.throw(any, 200)
         */
        case 2:
        default: {
          let code = 500;
          let data = undefined;
          if (!isNaN(Number(args[0]))) {
            code = args[0];
            data = args[1];
          } else if (!isNaN(Number(args[1]))) {
            code = args[1];
            data = args[0];
          } else {
            // if no code number, must be error
            code = 500;
            data = {
              code: args[0],
              message: args[1]
            };
          }
          response.code = code;
          if (data instanceof Error) {
            response.data = {
              code: data.code || data.number || response.code || 500,
              message: data.message
            };
          } else {
            response.data = Object.assign({
              code
            }, String(code) === '200' ? {
              data
            } : {
              message: data
            });
          }

          break;
        }
      }

      ctx.status = response.code;

      response.data = {
        code: response.data.code || response.code,
        data: response.data.data || '',
        message: response.data.message || (response.code > 400 ? STATUS_CODES[ctx.status] : '')
      };

      if (opts.json && typeof response.data === 'object') {
        response.data = JSON.stringify(response.data);
        ctx.set('Content-Type', ctx.get('Content-Type') || 'application/json;charset=utf8');
      } else {
        ctx.set('Content-Type', ctx.get('Content-Type') || 'text/html;charset=utf8');
      }

      if (cors) {
        ctx.set({
          'Access-Control-Allow-Origin': ctx.get('origin') || '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': ctx.get('Access-Control-Request-Method') || 'GET,POST,HEAD,DELETE,PUT,OPTIONS',
          'Access-Control-Allow-Headers': ctx.get('Access-Control-Request-Headers') || '*',
          'Access-Control-Max-Age': '86400'
        });
      }

      ctx.body = response.data;

      ctx.logger.accessApi[ctx.status < 400 ? 'info' : 'error'](`[${ctx.status}][${ctx.method.toUpperCase()}] ${ctx.originalUrl} ${ctx.body}`);
    };

    await next();
  };
};
