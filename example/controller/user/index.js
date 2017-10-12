const Context = require('../../../src/classes/context/index');

class User extends Context {
  async a() {
    const res = await this.fetch('//USER/users/:id', {
      params: {
        id: 1
      },
      query: {
        id:123
      }
    });

    console.log(res);
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
