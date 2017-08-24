/* eslint-disable no-underscore-dangle */
class Enum {
  constructor(obj) {
    this._raw = Object.keys(obj).reduce((total, key) => {
      total[key] = obj[key];
      total[obj[key]] = key;
    }, {});
  }
}
