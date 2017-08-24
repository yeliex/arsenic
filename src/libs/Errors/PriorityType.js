/**
 *
 * @class PriorityType
 * @author: yeliex
 * @create: 2017/8/24 上午11:12
 */
class PriorityType {
  @Private
  $priority;

  constructor(number) {
    this.$priority = number;
  }

  get priority() {
    return this.$priority;
  }

  toString() {
    return String(this.$priority);
  }
}

module.exports = PriorityType;
