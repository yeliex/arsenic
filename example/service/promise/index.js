const Context = require('../../../src').Context;

class PromiseService extends Context {
  timeout() {
    return new Promise((rec) => {
      setTimeout(() => {
        rec(123);
      }, 1000);
    });
  }
}

module.exports = PromiseService;
