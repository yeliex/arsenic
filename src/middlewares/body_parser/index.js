const koabody = require('koa-better-body');
const convert = require('koa-convert');
const compose = require('koa-compose');
const qs = require('qs');

const extraParser = () => async (ctx, next) => {
  ctx._GET = ctx.query;
  ctx._POST = ctx.request.fields;
  if (ctx._POST) {
    ctx.logger.api.info(`[${ctx.method.toUpperCase()}] ${ctx.originalUrl} ${JSON.stringify(ctx._POST)} ${ctx.request.body}`);
  }
  await next();
};

module.exports = () => compose([
  convert(koabody({
    querystring: require('qs')
  })),
  extraParser()
]);
