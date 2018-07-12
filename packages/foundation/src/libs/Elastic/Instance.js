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

module.exports = (model) => {
  const Instance = function Instance(raw, extra) {
    const origin = _.cloneDeep(raw);
    const that = new Object(raw);
    Object.defineProperties(that, {
      raw: {
        get() {
          return extra;
        }
      },
      get: {
        value(key) {
          return this[key];
        }
      },
      set: {
        value(key, value) {
          this[key] = value;
        }
      },
      save: {
        value() {
          if (_.isEqual(this, origin)) {
            return Promise.resolve({
              success: true,
              id: this.id,
              updated: false,
              total: 0,
              failures: []
            });
          }
          if (raw.id) {
            return model.updateById(raw.id, this.raw);
          }
          return model.create(this.raw);
        }
      },
      destroy: {
        value() {
          return model.destroyById(extra.id);
        }
      },
      update: {
        value: (doc) => {
          Object.keys(doc).forEach((k) => {
            this.set(k, doc[k]);
          });
          return this.save();
        }
      },
      toString: {
        value() {
          return JSON.stringify(this);
        }
      }
    });

    return that;
  };

  // 将es数据库查询结果转化为Instance对象
  Instance.parse = (data) => {
    if (!data) {
      return data;
    }
    if (data instanceof Array) {
      return data.map(item => Instance.parse(item));
    }
    const { _id, _score, _source, _version, _index, _type } = data;

    return new Instance({ id: _id, ..._source }, {
      id: _id,
      score: _score,
      version: _version,
      index: _index,
      type: _type
    });
  };

  Instance.decorate = (doc) => {
    const current = new Date();
    doc.utcCreate = doc.utcCreate || current;
    doc.utcModified = current;

    if (doc instanceof Instance) {
      delete doc.id;
    }

    return doc;
  };

  return Instance;
};
