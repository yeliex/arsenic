const { resolve } = require('path');
const { statSync } = require('fs');

const DBS = {
  mysql: require('./mysql'),
  elastic: require('./elastic')
};

const discoverDefine = (path) => {
  const stat = statSync(path);

  if (!stat.isFile()) {
    throw new Error(`db define must be js file like '{name}.define.js': ${path}`);
  }

  return require(path);
};

exports.all = (App) => {
  const supportDB = Object.keys(App.config.plugins).filter((k) => {
    return ['mongo', 'redis', 'mysql', 'elastic', 'redis'].includes(k);
  });

  const basePath = resolve(App.config.cwd, './config');
  const dbs = supportDB.forEach((dbName) => {
    if (!App.config.plugins[dbName] || !App.config.plugins[dbName].enable) {
      return;
    }

    DBS[dbName](App, discoverDefine(resolve(basePath, `./${dbName}.define.js`)));
  });
};
