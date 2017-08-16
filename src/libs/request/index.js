const fetch = require('autofetch');

let fetchLog = (require('../../index').Logger || {}).fetch;

fetch.baseHost((path) => {
  const host = process.env.NODE_ENV === 'production' ? '117sport.net' : 'daily.117sport.org';
  return path.replace(/^\/\/([A-Z]{1,})/, (a, b) => {
    return `http://service-${b.toLowerCase()}.${host}`;
  });
});

fetch.callback((response) => {
  return response.text().then((text) => {
    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  }).then((data) => {
    return response.ok ? data : Promise.reject(response.status === 500 ? data : {
      code: response.status,
      message: response.statusText
    });
  }).then((res) => {
    // ...log
    if (res.code && String(res.code).match(/^[A-Z]/)) {
      return Promise.reject(res.msg);
    }

    fetchLog.info(`[response][${response.status}] ${response.url} ${JSON.stringify(res)}`);
    return res;
  }).catch((e) => {
    if (e.code === 'S0-000-00-0002') {
      return Promise.reject(`系统错误: ${e.code}`);
    }
    fetchLog.error(`[response][${response.status}] ${response.url} ${typeof e === 'object' ? JSON.stringify(e) : e}`);
    return Promise.reject(e);
  });
});

fetch.headers({
  'User-Agent': 'node-fetch/1.0 autofetch/3 node beesport/3 like(BeeSport/3.0-660.1 (iPhone6; iOS/9.3))'
});

module.exports = (url, options = {}) => {
  if (!fetchLog) {
    fetchLog = require('../../index').Logger.fetch;
  }
  fetchLog.info(`[${options.method || 'GET'}] ${url} ${options.mock ? 'mock' : ''}`);
  return fetch(url, options);
};
