exports.converter = (obj) => {
  return Object.keys(obj).reduce((total, k) => {
    total[k] = obj[k];
    total[obj[k]] = k;
    return total;
  }, {});
};
