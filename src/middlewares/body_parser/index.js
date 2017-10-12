const koabody = require('koa-better-body');
const convert = require('koa-convert');
const compose = require('koa-compose');
const qs = require('qs');
const { toJSON } = require('../../libs/utils/xml');

const extraParser = (app) => async (ctx, next) => {
  ctx._GET = ctx.query;
  ctx._POST = ctx.request.fields;
  if (!ctx.request.fields && ctx.request.body) {
    const contentType = ctx.request.type;

    switch (contentType) {
    case 'text/xml': {
      ctx._POST = await toJSON(ctx.request.body);
      break;
    }
    default: {
      ctx._POST = ctx.request.body;
      break;
    }
    }
  }
  if (ctx._POST) {
    app.logger.apiData.info(`[${ctx.method.toUpperCase()}] ${ctx.originalUrl} ${JSON.stringify(ctx._POST)} ${ctx.request.body}`);
  }
  await next();
};

module.exports = (app) => compose([
  convert(koabody({
    querystring: require('qs')
  })),
  extraParser(app)
]);
