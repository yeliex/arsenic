/**
 * 错误系列构造函数
 * @class SeriesType
 * @author yeliex
 * @create 2017/8/23 下午2:18
 */
const assert = require('assert');

class SeriesType {
  @Private
  raw = {};

  constructor(number, comment) {
    assert(Number.isInteger(Number(number)));
    assert(typeof comment === 'string');

    this.raw = { number, comment };
  }

  get number() {
    return this.raw.number;
  }

  set number(number) {
    this.raw.number = number;
  }

  get comment() {
    return this.raw.comment;
  }

  set comment(comment) {
    this.raw.comment = comment;
  }

  toString() {
    return String(this.raw.number);
  }

  equals(obj) {
    if (!obj instanceof SeriesType) {
      return false;
    }
    return obj.number === this.raw.number && obj.comment === this.raw.comment;
  }
}

module.exports = SeriesType;
