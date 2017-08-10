class Context {
  constructor(ctx) {
    Object.assign(this, ctx);
  }

  get ctx() {
    return this;
  }
}

module.exports = Context;
