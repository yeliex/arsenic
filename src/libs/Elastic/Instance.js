/**
 *
 * @class Instance
 * @author: yeliex
 * @create: 2017/8/24 下午3:07
 */
const _ = {
  isEqual: require('lodash/isEqual'),
  cloneDeep: require('lodash/cloneDeep')
};

module.exports = (model) => class Instance extends Object {
  @Private
  $raw = {};

  @Private
  $extra = {};

  @Private
  $origin = {};

  constructor(raw, extra) {
    super(raw);
    this.$raw = raw;
    this.$origin = _.cloneDeep(raw);
    this.$extra = extra;
  }

  static parse = parse;

  static decorate = decorate;

  get raw() {
    return this.$extra;
  }

  set(key, value) {
    this.$raw[key] = value;
  }

  get(key) {
    return this[key];
  }

  save() {
    if (_.isEqual(this.$raw, this.$origin)) {
      return;
    }
    if (this.$raw.id) {
      return model.updateById(this.$raw.id, this.raw);
    }
    return model.create(this.raw);
  }

  destroy() {
    return model.destroyById(this.$extra.id);
  }

  update(doc = {}) {
    Object.keys(doc).forEach((k) => {
      this.set(k, doc[k]);
    });
    return this.save();
  }

  toString = this.toJson;

  toJson() {
    return JSON.stringify(this.$raw);
  }
};

// 将es数据库查询结果转化为Instance对象
function parse(data) {
  if (!data) {
    return data;
  }
  if (data instanceof Array) {
    return data.map(item => parse(item));
  }
  const { _id, _score, _source, _version, _index, _type } = data;

  return new Instance({ id: _id, ..._source }, {
    id: _id,
    score: _score,
    version: _version,
    index: _index,
    type: _type
  });
}

function decorate(doc) {
  const current = new Date();
  doc.utc_create = doc.utc_create || current;
  doc.utc_modified = current;

  if (doc instanceof Instance) {
    delete doc.id;
  }

  return doc;
}
