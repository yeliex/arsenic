const os = require('os');
const { resolve } = require('path');
const { existsSync, readFileSync } = require('../fs/index');

const filePaths = {
  initFile: resolve('/.dockerinit'),
  envFile: resolve('/.dockerenv'),
  cgroup: resolve('/proc/1/cgroup')
};

const flags = {
  isContainer: false
};

// sync get docker container env
if (existsSync(filePaths.initFile) || existsSync(filePaths.envFile)) {
  flags.isContainer = true;
} else if (existsSync(filePaths.cgroup)) {
  flags.isContainer = (readFileSync(filePaths.cgroup, 'utf8') || '').includes('docker');
}

const padStr = (str, length) => {
  return str >= length ? str.substr(0, length) : str.padStart(length, '0');
};

exports.localIp = (() => {
  return (((os.networkInterfaces().en0 || []).filter(({ family }) => family === 'IPv4')[0] || {}).address || '').split('.').map((str) => {
    return padStr(Number(str, 10).toString(16), 2);
  }).join('');
})();

exports.containerId = (() => {
  const pid = Number(process.pid, 10).toString(16);
  if (flags.isContainer) {
    return `0${padStr(process.env.HOSTNAME, 8)}${pid.padStart(2, '0')}`;
  }
  return `1${exports.localIp}${pid.padStart(4, '0')}`;
})();
