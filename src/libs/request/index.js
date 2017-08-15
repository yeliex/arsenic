const fetch = require('autofetch');

fetch.baseHost((path) => {
  return path.replace(/^\/\/([A-Z]{1,})/, (a, b) => {
    return `http://service-${b.toLowerCase()}.117sport.net`;
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
    return res;
  }).catch((e) => {
    if (e.code === 'S0-000-00-0002') {
      return Promise.reject(`系统错误: ${e.code}`);
    }
    return Promise.reject(e);
  });
});

fetch.headers({
  'User-Agent': 'node-fetch/1.0 autofetch/3 node beesport/3 like(BeeSport/3.0-660.1 (iPhone6; iOS/9.3))'
});

module.exports = (url, options = {}) => {
  return fetch(url, options);
};
