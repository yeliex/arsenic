const { parse, format } = require('url');
const { extname } = require('path');
const { BUCKETS } = require('../enums');
const BUCKET_PROTOCOL = 'bucket:';

exports.parseBucketUrl = (url, { w } = {}) => {
  if (!url) {
    return;
  }
  const parsedUrl = parse(url, true);
  if (parsedUrl.protocol.toLowerCase() !== BUCKET_PROTOCOL) {
    return url;
  }
  return format({
    protocol: 'https:',
    host: BUCKETS[parsedUrl.hostname] || '',
    pathname: `${parsedUrl.pathname}${w ? `@w=${w}` : ''}` || ''
  });
};

// todo
exports.parseHttpUrl = (url) => {

};

exports.parseUrl = (url) => {
  if (url.startsWith(BUCKET_PROTOCOL)) {
    return exports.parseBucketUrl(url);
  }
  return exports.parseHttpUrl(url);
};
