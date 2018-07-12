/**
 * 外部错误/内部错误
 * @class SourceType
 * @author: yeliex
 * @create: 2017/8/24 上午11:20
 */
class SourceType {
  @Private
  $source;

  constructor(source) {
    this.$source = source;
  }

  get source() {
    return this.$source;
  }

  toString() {
    return String(this.$source);
  }
}

module.exports = SourceType;
