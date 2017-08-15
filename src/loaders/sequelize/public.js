const Sequelize = require('sequelize');

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
    underscored: false,
    createdAt: 'createdTime',
    updatedAt: 'updateTime',
    deletedAt: 'deletedTime'
  }
};

exports.option = (option = {}) => Object.assign({}, publicOption.option, option);

exports.model = (model = {}) => {
  const schemes = Object.assign({}, publicOption.scheme);
  Object.keys(model).forEach((key) => {
    if (model[key] === false) {
      delete schemes[key];
    }
    schemes[key] = model[key];
    return schemes;
  });
  return schemes;
};

exports.uuid = { type: Sequelize.UUID, allowNull: false, defaultValue: Sequelize.UUIDV4 };
