const { resolve } = require('path');
const { statSync } = require('fs');

const DBS = {
  mysql: require('./mysql/index'),
  elastic: require('./elastic/index'),
  redis: require('./redis/index'),
  mongo: require('./mongo/index')
};

const discoverDefine = (path) => {
  try {
    const stat = statSync(path);

    if (!stat.isFile()) {
      return undefined;
    }

    return require(path);
  } catch (e) {
    return undefined;
  }
};

exports.all = (App) => {
  const supportDB = Object.keys(App.config.plugins || {}).filter((k) => {
    return ['mongo', 'redis', 'mysql', 'elastic', 'redis'].includes(k);
  });

  const basePath = resolve(App.config.cwd, './define');
  const dbs = supportDB.forEach((dbName) => {
    if (!App.config.plugins[dbName] || !App.config.plugins[dbName].enable) {
      return;
    }

    if (typeof DBS[dbName] === 'function') {
      DBS[dbName](App, discoverDefine(resolve(basePath, `./${dbName}.define.js`)));
    } else {
      throw new Error(`cannot find ${dbName} driver, maybe not required`);
    }
  });
};
