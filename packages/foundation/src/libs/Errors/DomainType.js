/**
 * 错误领域
 * @class DomainType
 * @author: yeliex
 * @create: 2017/8/23 下午2:40
 */
const assert = require('assert');

class DomainType {
  @Private
  $name;

  constructor(name) {
    assert(typeof name === 'string');

    this.$name = name;
  }

  hashCode() {
    return this.$name;
  }

  toString() {
    return String(this.$name);
  }
}

module.exports = DomainType;
