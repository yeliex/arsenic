const fetch = require('autofetch');

let fetchLog = null;

fetch.baseHost((path) => {
  const host = process.env.NODE_ENV === 'production' ? '117sport.net' : '117sport.org';
  return path.replace(/^\/\/([A-Z-_]{1,})/, (a, b) => {
    return `http://service-${b.toLowerCase()}.${host}`;
  });
});

fetch.callback((response) => {
  const requestid = response.headers.get('x-system-requestid');
  return response.text().then((text) => {
    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  }).then((data) => {
    return response.ok ? data : Promise.reject(response.status === 500 ? data : {
      code: response.status,
      message: (data || {}).message || data || response.statusText
    });
  }).then((res) => {
    // ...log
    if (res.code && String(res.code).match(/^[A-Z]/)) {
      return Promise.reject(res.msg);
    }

    fetchLog.info(`[response][${response.status}] ${requestid} ${response.url} ${JSON.stringify(res)}`);
    return res.data || res;
  }).catch((e) => {
    fetchLog.error(`[response][${response.status}] ${requestid} ${response.url} ${typeof e === 'object' ? JSON.stringify(e) : e}`);
    if (e.code === 'S0-000-00-0002') {
      return Promise.reject(`系统错误: ${e.code}`);
    }
    return Promise.reject(e);
  });
});

fetch.headers({
  'User-Agent': 'node-fetch/1.0 autofetch/3 node beesport/3 like(BeeSport/3.0-660.1 (iPhone6; iOS/9.3))'
});

module.exports = (app) => (url, options = {}) => {
  if(!fetchLog){
    fetchLog = app.logger.fetch;
  }
  fetchLog.info(`[${options.method || 'GET'}] ${url} ${options.mock ? 'mock' : ''}`);
  return fetch(url, options);
};
