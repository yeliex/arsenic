/**
 *
 * @class Elastic
 * @author: yeliex
 * @create: 2017/8/24 下午2:53
 */
const Elasticsearch = require('elasticsearch');
const Model = require('./Model');

class Elastic {
  @Private
  $models = {};

  @Private
  $hosts;

  @Private
  $client;

  constructor({ hosts } = {}) {
    this.$hosts = hosts;
    this.$client = new Elasticsearch.Client({
      hosts
    });
  }

  define(name, attributes, options) {
    options.type = options.type || name;
    this.$models[name] = new Model(attributes, options, this.client);
  }

  get models() {
    return this.$models;
  }

  get client() {
    return this.$client;
  }
}

module.exports = Elastic;
