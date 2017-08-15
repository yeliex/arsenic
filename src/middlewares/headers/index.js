const { parse } = require('ua-parser');
const { traceId } = require('../../libs/utils/trace/index');
const Headers = require('node-fetch/lib/headers');

const spreadHeaders = [
  'X-System-TraceId',
  'X-System-RpcId',
  'X-System-RequestID'
];

module.exports = () => async (ctx, next) => {
  const headers = {};

  // trace
  headers['X-System-RpcId'] = ctx.get('X-System-RpcId') || '0';
  headers['X-System-TraceId'] = ctx.get('X-System-TraceId') || traceId();

  const ua = parse(ctx.get('user-agent'));

  // ua
  headers['X-UA-AppName'] = ctx.get('X-UA-AppName') || ua.ua.family;
  headers['X-UA-AppVersion'] = ctx.get('X-UA-AppVersion') || ua.ua.toVersionString();
  headers['X-UA-OSName'] = ctx.get('X-UA-OSName') || ua.os.family;
  headers['X-UA-OSVersion'] = ctx.get('X-UA-OSVersion') || ua.os.toVersionString();
  headers['X-UA-DeviceName'] = ctx.get('X-UA-DeviceName') || ua.device.family;
  headers['X-UA-MarketName'] = ctx.get('X-UA-MarketName') || '';

  headers['ZONE_ID_HEADER'] = ctx.get('ZONE_ID_HEADER');
  headers['X-Forwarded-For'] = ctx.get('X-Forwarded-For');
  headers['X-DEVICE-ID'] = ctx.get('X-DEVICE-ID');

  // user
  headers['X-User-UserId'] = ctx.get('X-User-UserId');
  headers['X-User-CompanyId'] = ctx.get('X-User-CompanyId');

  ctx._HEADERS = new Headers(headers);

  ctx._USER = Object.assign({}, ctx._USER || {}, {
    userId: ctx.get('X-User-UserId'),
    companyId: ctx.get('X-User-CompanyId')
  });

  await next(ctx);
};
