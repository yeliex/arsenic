const fetch = require('./fetch');

module.exports = (url, options = {}) => {
  console.info(`[${options.method || 'GET'}] ${url} ${options.mock ? 'mock' : ''}`);

  return fetch(url, options).then(({ data, response }) => {
    const requestId = response.headers.get('x-system-requestid');

    console.info(`[response][${response.status}] ${requestId || ''} ${response.url} ${JSON.stringify(data)}`);

    return data;
  }).catch(({ error, response }) => {
    const requestId = response.headers.get('x-system-requestid');

    console.error(`[response][${response.status}] ${requestId} ${response.url} ${typeof e === 'object' ? JSON.stringify(error) : error}`);

    if (error.code === 'S0-000-00-0002') {
      return Promise.reject(`系统错误: ${error.code}`);
    }

    if (response.status !== 200) {
      return Promise.reject({
        code: response.status,
        msg: error.message || error.msg || error
      });
    }

    return Promise.reject(error.message || error.msg || error);
  });
};
