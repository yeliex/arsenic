/**
 *
 * @class Message
 * @author: yeliex
 * @create: 2017/8/30 上午10:35
 */
const { Message: MQMessage } = require('rocketmq');
const assert = require('assert');

class Message {
  @Private
  $message;

  constructor(message) {
    assert(message instanceof MQMessage);
    this.$message = message;
  }

  get msgId() {
    return this.$message.msgId;
  }

  get topic() {
    return this.$message.topic;
  }

  get tags() {
    return this.$message.properties.TAGS;
  }

  get tag() {
    return this.$message.properties.TAGS;
  }

  get keys() {
    return this.$message.properties.KEYS;
  }

  get key() {
    return this.$message.properties.KEYS;
  }

  get uniqKey() {
    return this.$message.properties.UNIQ_KEY;
  }

  get wait() {
    return this.$message.properties.WAIT;
  }

  get buffer() {
    return this.$message.body;
  }

  toString() {
    return this.buffer.toString('utf8');
  }

  get text() {
    return this.toString();
  }

  get json() {
    return JSON.parse(this.text);
  }
}

module.exports = Message;
