const Sequelize = require('sequelize');
const _ = {
  snakeCase: require('lodash/snakeCase')
};

exports.jsonSet = (key = 'extend') => {
  return function jsonSet(val) {
    return this.setDataValue(key, JSON.stringify(val || {}));
  };
};

exports.jsonGet = (key = 'extend') => {
  return function jsonGet() {
    return JSON.parse(this.getDataValue(key) || '{}');
  };
};

exports.json = (key = 'extend') => {
  return {
    type: Sequelize.TEXT('long'),
    allowNull: true,
    get: exports.jsonGet(key),
    set: exports.jsonSet(key)
  };
};

const publicOption = {
  scheme: {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    extend: exports.json('extend')
  },
  option: {
    timestamps: true,
    paranoid: true,
    underscored: true,
    underscoredAll: true,
    createdAt: 'utc_create',
    updatedAt: 'utc_modified',
    deletedAt: 'utc_deleted'
  }
};

exports.option = (option = {}) => Object.assign({}, publicOption.option, option);

exports.model = (model = {}) => {
  const schemes = Object.assign({}, publicOption.scheme);
  Object.keys(model).forEach((key) => {
    let def = model[key];
    if (def === false) {
      delete schemes[key];
    } else {
      if (typeof def !== 'object') {
        def = {
          type: def
        };
      }
      def.field = def.field || _.snakeCase(key);
      schemes[key] = def;
    }
  });
  return schemes;
};

exports.uuid = { type: Sequelize.UUID, allowNull: false, defaultValue: Sequelize.UUIDV4 };
