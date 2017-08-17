const { basename, extname } = require('path');
const glob = require('glob');

const _ = {
  camelCase: require('lodash/camelCase')
};

module.exports = (pattern, options) => {
  const contexts = glob.sync(pattern, {
    ...options,
    absolute: true
  });
  return contexts.reduce((total, path) => {
    if (options.exclude && path.match(options.exclude)) {
      return total;
    }
    total[_.camelCase(basename(path, extname(path)))] = require(path);
    return total;
  }, {});
};
