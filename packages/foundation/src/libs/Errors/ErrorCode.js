/**
 * @class ErrorCode
 * @author: yeliex
 * @create: 2017/8/23 下午2:44
 */
const assert = require('assert');

class ErrorCode {
  @Private
  $code;

  @Private
  $comment;

  constructor(code, comment) {
    assert(Number.isInteger(code));
    assert(typeof comment === 'string');

    this.$code = code;
    this.$comment = comment;
  }

  get code() {
    return this.$code;
  }

  set code(code) {
    this.$code = code;
  }

  get comment() {
    return this.$comment;
  }

  set comment(comment) {
    this.$comment = comment;
  }

  equals(obj) {
    if (!obj instanceof ErrorCode) {
      return false;
    }

    return obj.code === this.comment && obj.comment === this.comment;
  }

  get hashCode() {
    return this.code;
  }

  toString() {
    return String(this.code).padStart(4, '0');
  }
}

module.exports = ErrorCode;
