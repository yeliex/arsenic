/* eslint-disable no-underscore-dangle */
/**
 *
 * @class Model
 * @author: yeliex
 * @create: 2017/8/24 下午2:56
 */
const Instance = require('./Instance');

class Model {
  @Private
  $attributes; // 预留类型校验

  @Private
  $options;

  @Private
  $client;

  @Private
  $Instance = Instance(this);

  constructor(attributes, options, client) {
    this.$attributes = attributes;
    this.$options = options;
    this.$client = client;
  }

  get client() {
    return this.$client;
  }

  get index() {
    return this.$options.index;
  }

  get type() {
    return this.$options.type;
  }

  get indexType() {
    return {
      index: this.index,
      type: this.type
    };
  }

  getQuery(query) {
    const page = query.page ? {
      size: query.page.pageSize || 20,
      from: query.page.size * query.page.page

    } : {};

    return {
      ...this.indexType,
      refresh: true,
      body: {
        size: query.page.size || query.size || 10000,
        from: query.from,
        query: query.where,
        sort: query.sort,
        script: query.script,
        upsert: query.upsert === true ? query.doc : query.upsert,
        doc: query.doc,
        aggs: query.aggs
      }
    };
  }

  findById(id) {
    return this.client.get({
      ...this.indexType,
      _source: false,
      id
    }).then(this.$Instance.parse.bind(this));
  }

  exist(id) {
    return this.client.exist({
      ...this.indexType,
      id
    });
  }

  count(query) {
    return this.client.count(this.getQuery(query)).then((res) => res.count);
  }

  findOne(...args) {
    return this.search(...args).then((data) => this.$Instance.parse.bind(this)(data[0]));
  }

  find(query, ...args) {
    if (query.where && query.where.id) {
      return this.findById(query.where.id, ...args);
    }
    return this.search(query, ...args);
  };

  search(query) {
    return this.client.search(this.getQuery(query)).then(this.$Instance.parse.bind(this));
  }

  destroyById(id) {
    return this.client.delete({
      ...this.indexType,
      id,
      refresh: true
    });
  }

  destroy(query) {
    if (query.where && query.where.id) {
      return this.destroyById(query.where.id);
    }

    return this.client.deleteByQuery(this.getQuery(query));
  }

  updateById(id, doc) {
    return this.client.update({
      ...this.indexType,
      id,
      refresh: true,
      body: {
        doc
      }
    });
  }

  update(query, doc) {
    query.doc = doc;
    if (query.where.id) {
      if (query.upsert) {
        throw new Error('[elastic] cannot upsert with id');
      }
      return this.updateById(query.where.id);
    }
    return this.client.update(this.getQuery(query));
  }

  upsert(query, doc) {
    return this.update(query, doc);
  }

  createById(id, doc) {
    return this.client.index({
      ...this.indexType,
      id,
      refresh: true,
      body: doc
    }).catch((e) => {
      if (e.statusCode === 409) {
        return Promise.reject('id已存在');
      }
      return Promise.reject(e);
    });
  }

  create(doc) {
    return this.client.index({
      ...this.indexType,
      refresh: true,
      body: doc
    });
  }
}

module.exports = Model;
