class Context {
  constructor(ctx) {
    console.log(this);
    Object.assign(this, ctx);
    console.log(this);
  }

  get ctx() {
    return this;
  }
}
