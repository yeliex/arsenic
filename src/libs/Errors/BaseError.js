/**
 * 错误基类
 * @class BaseError
 * @author: yeliex
 * @create: 2017/8/23 下午3:58
 */
const LevelType = require('./LevelType');
const DomainTypes = require('./DomainTypes');
const SeriesTypes = require('./SeriesTypes');
const SourceTypes = require('./SourceTypes');
const PriorityTypes = require('./PriorityTypes');
const { UNKNOWN_CODE } = require('./ErrorCodes');

class BaseError {
  @Private
  $domainType = DomainTypes.B;

  @Private
  $seriesType = SeriesTypes.COMMON;

  @Private
  $source = SourceTypes.INNER;

  @Private
  $priority = PriorityTypes.P0;

  @Private
  $levelType = LevelType.ERROR;

  @Private
  $code = UNKNOWN_CODE;

  @Private
  $message = '';

  @Private
  $cause;

  @Private
  $readOnly = {};

  /**
   * 将自己clone一份导出
   * @returns {Error}
   */
  copy() {
    const errors = new BaseError();

    errors.domainType = this.domainType;
    errors.code = this.code;
    errors.levelType = this.levelType;
    errors.message = this.message;
    errors.cause = this.cause;
    errors.priority = this.priority;
    errors.seriesType = this.seriesType;
    errors.source = this.source;

    return errors;
  }

  get writableErrors() {
    return this.copy();
  }

  isWarning() {
    return this.$levelType ? this.$levelType.level === LevelType.WARNING.level : false;
  }

  isError() {
    return this.$levelType ? this.$levelType.level === LevelType.ERROR.level : false;
  }

  get domainType() {
    return this.$domainType;
  }

  set domainType(domainType) {
    this.$domainType = domainType;
  }

  get seriesType() {
    return this.$seriesType;
  }

  set seriesType(seriesType) {
    this.$seriesType = seriesType;
  }

  get source() {
    return this.$source;
  }

  set source(source) {
    this.$source = source;
  }

  get priority() {
    return this.$priority;
  }

  set priority(priority) {
    this.$priority = priority;
  }

  get code() {
    return this.$code;
  }

  set code(code) {
    this.$code = code;
  }

  get cause() {
    return this.$cause;
  }

  set cause(cause) {
    this.$cause = cause;
  }

  get levelType() {
    return this.$levelType;
  }

  set levelType(levelType) {
    this.$levelType = levelType;
  }

  get message() {
    return this.$message ? this.$message.toString() : this.$code.comment;

  }

  set message(message) {
    this.$message = String(message);
  }

  appendMsg(str) {
    this.$message += str;
  }

  get codeString() {
    return `${this.$domainType.toString()}${[this.$levelType.toString(), this.seriesType, this.priority, this.code].join('-')}`;
  }

  get codeStringWithMsg() {
    return this.message ? `${this.codeString} ${this.message}` : this.codeString;
  }

  setRetryStratgy(times, interval) {
    throw new Error('not supported', this);
  }

  get hashCode() {
    let result = this.domainType ? this.domainType.hashCode : 0;
    result = 31 * result + (this.seriesType ? this.seriesType.hashCode : 0);
    result = 31 * result + (this.source ? this.source.hashCode : 0);
    result = 31 * result + (this.priority ? this.priority.hashCode : 0);
    result = 31 * result + (this.levelType ? this.levelType.hashCode : 0);
    result = 31 * result + (this.code ? this.code.hashCode : 0);
    result = 31 * result + (this.message ? this.message.hashCode : 0);
    result = 31 * result + (this.cause ? this.cause.hashCode : 0);
    result = 31 * result;
    result = 31 * result + (this.readOnly ? 1 : 0);

    return result;
  }

  get readOnly() {
    return this.$readOnly;
  }

  set readOnly(readOnly) {
    this.$readOnly = readOnly;
  }

  toString() {
    return this.codeStringWithMsg;
  }

  equals(error) {
    if (!error instanceof BaseError) {
      return false;
    }

    return !['readOnly', 'domainType', 'equals', 'source', 'priority', 'levelType', 'code', 'message', 'cause', 'retry'].some((key) => {
      const current = this[key];
      const next = error[current];
      return typeof current === 'object' ? !current.equal(next) : current !== next;
    });
  }
}

module.exports = BaseError;
