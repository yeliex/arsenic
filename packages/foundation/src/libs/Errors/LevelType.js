/**
 * 错误的等级,部分错误只是警告,可以作为判断是否失败的依据
 * @class LevelType
 * @author yeliex
 * @create 2017/8/23 下午2:18
 */
const assert = require('assert');

class LevelType {

  static INFO = new LevelType(2);

  static WARNING = new LevelType(1);

  static ERROR = new LevelType(0);

  @Private
  $level;

  constructor(level) {
    assert(Number.isInteger(level));

    this.$level = level;
  }

  get level() {
    return this.$level;
  }

  toString() {
    return String(this.$level);
  }
}

module.exports = LevelType;
