const Error = require('./BaseError');
const Errors = require('./Error');

Object.defineProperties(Error, Object.keys(Errors).reduce((total, key) => {
  total[key] = {
    value: Errors[key]
  };
  return total;
}, {}));

module.exports = Error;
