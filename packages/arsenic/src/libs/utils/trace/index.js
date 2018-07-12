const { containerId } = require('../os/index');

const toHex = (str) => Number(str).toString(16);

exports.traceId = () => {
  const time = toHex(new Date().getTime());
  const random = toHex(Number(Number(Math.random() * 3096).toFixed(0)) + 1000);

  return [
    toHex(containerId.length),
    toHex(time.length),
    containerId,
    time,
    random
  ].join('');
};
