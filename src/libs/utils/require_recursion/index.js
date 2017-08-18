const fs = require('fs');
const { resolve, basename, extname } = require('path');
const _ = {
  camelCase: require('lodash/camelCase')
};

const recursion = ({ cwd } = {}) => {
  const items = fs.readdirSync(cwd).sort((a, b) => {
    return b === 'index.js';
  });
  let total = {};

  items.forEach((item) => {
    const path = resolve(cwd, item);
    const name = _.camelCase(extname(item) ? basename(item, extname(item)) : item);

    if (item === 'index.js') {
      total.index = require(path);
      return;
    }

    const stat = fs.statSync(path);

    if (total[name]) {
      throw new Error(`duplicate controller: ${resolve(cwd, item)}`);
    }

    if (stat.isDirectory()) {
      total[name] = recursion({ cwd: path });
      return;
    }

    total[name] = require(path);
  });

  return total;
};

module.exports = recursion;
