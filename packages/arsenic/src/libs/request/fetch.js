const fetch = require('autofetch');

fetch.callback((response) => {
  return response.text().then((text) => {
    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  }).then((data) => {
    return response.ok ? data : Promise.reject(response.status === 500 ? data : {
      code: data.code || response.status,
      msg: (data || {}).msg || (data || {}).message || data || response.statusText
    });
  }).then((res) => {
    // 符合错误代码的格式
    if (res.code && String(res.code).match(/^[A-Z]/)) {
      return Promise.reject(res);
    }

    return {
      data: (res.data || res.data === false) ? res.data : res,
      response
    };
  }).catch((e) => {
    return Promise.reject({
      error: e,
      response
    });
  });
});

fetch.headers({
  'User-Agent': 'node-fetch/1.0 autofetch/3 arsenic/1 node like(iPhone6; iOS/9.3)'
});

module.exports = fetch;
