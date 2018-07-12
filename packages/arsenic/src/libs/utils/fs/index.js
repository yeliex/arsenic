const { accessSync, statSync, readFileSync } = require('fs');

exports.existsSync = (...args) => {
  try {
    return !!accessSync(...args);
  } catch (e) {
    return false;
  }
};

exports.dirExistsSync = (...args) => {
  try {
    return statSync(...args).isDirectory();
  } catch (e) {
    return false;
  }
};

exports.readFileSync = readFileSync;
