const RocketMQ = require('rocketmq');
const urllib = require('urllib');
const assert = require('assert');
const co = require('co');
const user = require('os').userInfo().username;
const Message = require('./Message');

class Topic {
  constructor(topic, config) {
    const { topic: topicName, consumer, producer, tags } = topic;

    this.Tags = tags;
    this.Topic = topicName;
    this.Listeners = {};
    this.Logger = config.logger || console;

    if (consumer) {
      this.Comsumer = new RocketMQ.Consumer({
        ...config,
        consumerGroup: config.debug ? `${consumer}_${user}` : consumer,
        urllib
      });

      //this.Comsumer.subscribe(topicName, tags.join(' || '));
      this.Comsumer.subscribe(topicName, '*');

      this.Comsumer.on('message', this.dispatch.bind(this));

      this.Comsumer.on('error', (err) => this.Logger.error(err.stack));
    }

    if (producer) {
      this.Producer = new RocketMQ.Producer({
        ...config,
        producerGroup: config.debug ? `${producer}_${user}` : producer,
        urllib
      });
    }
  }

  dispatchMsg(msg) {
    return Promise.resolve().then(() => {
      const message = new Message(msg);
      this.Logger.info(`[mq:receive] ${message.msgId} ${message.topic} ${message.tags} ${message.keys} ${message.toString()}`);
      const listener = this.Listeners[message.tag] || {};
      if (typeof listener.handler === 'function') {
        return listener.handler(message);
      }
      this.Logger.warn(`[mq:client] no listener: ${message.tag}, [ACK]`);
      return true;
    });
  }

  dispatch(msgs, ack) {
    msgs = msgs instanceof Array ? msgs : [msgs];
    let promise = Promise.resolve([]);
    msgs.forEach((msg) => {
      promise = promise.then((total = []) => {
        return this.dispatchMsg(msg).then((res) => {
          total.push(res);
          return total;
        });
      });
    });
    promise.then((total) => {
      if (!total.some(res => res !== true)) {
        ack();
      }
      this.Logger.warn(`[mq:producer:response] ${JSON.stringify(msgs)} ${total}`);
    });
  }

  listen(tags, handler) {
    assert(typeof handler === 'function', 'listener handler must be function');
    tags = typeof tags === 'string' ? tags.replace(/ /g, '').split('||') : tags;
    tags.forEach((tag) => {
      if (this.Listeners[tag]) {
        this.Logger.error(`[mq: client] Duplicate listener: ${this.Topic}=>${tag}, ignore`);
      }
      this.Listeners[tag] = {
        handler: handler
      };
    });
  }

  send(tag, body) {
    body = typeof body === 'string' ? body : JSON.stringify(body);
    return new Promise((rec, rej) => {
      const message = new RocketMQ.Message(this.Topic, tag, body);

      const send = this.Producer.send.bind(this.Producer);
      co(function* () {
        try {
          const res = yield send(message);
          rec(res);
        } catch (e) {
          rej(e);
        }
      });
    }).then((res) => {
      return {
        success: res.sendStatus === 'SEND_OK',
        msgId: res.msgId,
        message: res.messageQueue,
        res
      };
    });
  }
}

module.exports = Topic;
