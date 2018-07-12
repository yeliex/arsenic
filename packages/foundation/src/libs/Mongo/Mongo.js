const MongoDB = require('node.mongo');

class Mongo {
  @Private
  $models = {};

  @Private
  $host;

  @Private
  $port;

  @Private
  $options;

  constructor({ host, port, options = {} }) {
    this.$host = host;
    this.$port = port;
    this.$options = options;
  }

  define(name) {
    const url = `${this.$host.replace(/^(mongodb:\/\/)?/, 'mongodb://')}${this.$port ? `:${this.$port}` : ''}/${name}`;
    this.$models[name] = MongoDB(url, this.$options);
  }

  get models() {
    return this.$models;
  }
}

module.exports = Mongo;
