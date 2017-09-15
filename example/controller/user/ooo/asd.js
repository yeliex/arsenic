const Context = require('../../../../src/classes/context/index');

class User extends Context {
  a() {
    return this.Service.user.getUserList().then((res) => {
      this.throw(200, res);
    });
  }

  b() {
    return this.Service.promise.timeout().then((res) => {
      this.throw(200, res);
    });
  }

  list() {
    return this.Service.promise.timeout().then((res) => {
      this.throw(200, 'list');
    });
  }

  create() {
    return this.Service.promise.timeout().then((res) => {
      this.throw(200, 'create');
    });
  }

  item() {
    return this.Service.promise.timeout().then((res) => {
      this.throw(200, 'item');
    });
  }
}

module.exports = User;
