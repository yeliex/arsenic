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
    const q = {
      ...this.indexType,
      refresh: query.fresh,
      body: {
        query: query.where,
        sort: query.sort,
        script: query.script,
        upsert: query.upsert === true ? query.doc : query.upsert,
        doc: query.doc,
        aggs: query.aggs
      }
    };

    if (query.page === false) {
      return q;
    }

    const page = query.page ? {
      size: query.page.size || 20,
      from: query.page.size * query.page.page
    } : {};

    q.body.size = page.size || query.size || 10000;
    q.body.from = page.from || query.from;
    return q;
  }

  /**
   * Find One By ID
   * @param id
   * @returns {Promise.<Instance>} result or undefined
   */
  findById(id) {
    return this.client.get({
      ...this.indexType,
      _source: false,
      id
    }).then(this.$Instance.parse.bind(this));
  }

  /**
   * Exist
   * @param id
   * @returns {Promise.<boolean>}
   */
  exist(id) {
    return this.client.exist({
      ...this.indexType,
      id
    });
  }

  /**
   * count
   * @param query
   * @returns {Promise.<number>}
   */
  count(query) {
    query.page = false;
    return this.client.count(this.getQuery(query)).then((res) => res.count);
  }

  /**
   * Find One
   * @param query
   * @returns {Promise.<Instance>}
   */
  findOne(query) {
    query.size = 1;
    return this.search(query).then(res => res[0]);
  }

  /**
   * Find Query
   * @param query
   * @returns {Promise.<Array[Instance]>}
   */
  find(query) {
    if (query.where && query.where.id) {
      return this.findById(query.where.id);
    }
    return this.search(query);
  };

  search(query) {
    return this.client.search(this.getQuery(query)).then((res = {}) => {
      return (res.hits || {}).hits || [];
    }).then(this.$Instance.parse.bind(this));
  }

  /**
   * Delete By Id
   * @param id
   * @returns {Promise.<boolean>}
   */
  destroyById(id) {
    return this.client.delete({
      ...this.indexType,
      id,
      refresh: true
    }).then((res) => ['deleted', 'not_found'].includes(res.result));
  }

  /**
   * Delete
   * @param query
   * @returns {Promise.<number>} deleted count
   */
  destroy(query) {
    query.fresh = true;

    if (query.where && query.where.id) {
      return this.destroyById(query.where.id);
    }

    return this.client.deleteByQuery(this.getQuery(query)).then((res) => res.deleted);
  }

  /**
   * Update By Id
   * @param id
   * @param doc
   * @returns {Promise.<object>}
   */
  updateById(id, doc) {
    return this.client.update({
      ...this.indexType,
      id,
      refresh: true,
      body: {
        doc
      }
    }).then((res) => {
      return {
        success: true,
        id: res._id,
        upsert: !!res.created
      };
    });
  }

  /**
   * Update by quert
   * @param query
   * @param doc(by id) or script(by query)
   * @return {Promise.<Object>}
   */
  update(query, doc) {
    query.fresh = true;
    if (query.where.id) {
      query.doc = doc;
      if (query.upsert) {
        throw new Error('[elastic] cannot upsert with id');
      }
      return this.updateById(query.where.id);
    }
    query.script = doc;
    return this.client.update(this.getQuery(query)).then((res) => {
      return {
        success: true,
        id: res._id,
        updated: !!res.updated,
        total: res.total,
        failures: res.failures
      };
    });
  }

  /**
   * @alias update
   */
  upsert = this.update;

  /**
   * Create By Id
   * @param id
   * @param doc
   * @return {Promise.<T>}
   */
  createById(id, doc) {
    return this.client.create({
      ...this.indexType,
      id,
      refresh: true,
      body: doc
    }).then((res) => {
      return {
        success: ['updated', 'created'].includes(res.result),
        update: res.result === 'updated',
        id: res._id
      };
    }).catch((e) => {
      if (e.statusCode === 409) {
        return Promise.reject('id已存在');
      }
      return Promise.reject(e);
    });
  }

  /**
   * Create
   * @param doc
   * @return {Promise.<object>}
   */
  create(doc) {
    return this.client.index({
      ...this.indexType,
      refresh: true,
      body: doc
    }).then((res) => {
      return {
        success: res.created,
        id: res._id
      };
    });
  }
}

module.exports = Model;
