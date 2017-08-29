const Context = require('../../../src/classes/context/index');

class User extends Context {
  a() {
    throw new this.Errors.TEST_ERROR();

    return this.service.user.getUserList().then((res) => {
      this.throw(200, res);
    });
  }

  b() {
    return this.service.promise.timeout().then((res) => {
      this.throw(200, res);
    });
  }

  list() {
    return this.service.promise.timeout().then((res) => {
      this.throw(200, 'list');
    });
  }

  create() {
    return this.service.promise.timeout().then((res) => {
      this.throw(200, 'create');
    });
  }

  item() {
    return this.service.promise.timeout().then((res) => {
      this.throw(200, 'item');
    });
  }
}

module.exports = User;
