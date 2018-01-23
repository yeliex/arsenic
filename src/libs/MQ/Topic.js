const RocketMQ = require('rocketmq');
const urllib = require('urllib');
const assert = require('assert');
const co = require('co');
const httpclient = require('http');
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
        urllib,
        httpclient
      });
    }

    if (producer) {
      this.Producer = new RocketMQ.Producer({
        ...config,
        producerGroup: config.debug ? `${producer}_${user}` : producer,
        urllib,
        httpclient
      });
    }
  }

  startListen() {
    if (this.Comsumer && !this.isListen) {
      const avaliableTags = Object.keys(this.Listeners);

      this.Comsumer.subscribe(this.Topic, avaliableTags.join('||'), this.dispatch.bind(this));
      this.Comsumer.on('error', (err) => this.Logger.error(err.stack));
      this.isListen = true;
    }
  }

  start() {
    return this.startListen();
  }

  dispatchMsg(msg) {
    const message = new Message(msg);
    this.Logger.info(`[mq:receive] ${message.msgId} ${message.topic} ${message.tags} ${message.keys} ${message.toString()}`);

    const listener = this.Listeners[message.tag] || {};

    if (typeof listener.handler === 'function') {
      return listener.handler(message);
    }

    this.Logger.warn(`[mq:client] no listener: ${message.tag}, [ACK]`);
    return Promise.resolve();
  }

  * dispatch(msg) {
    return this.dispatchMsg(msg).then((res) => {
      this.Logger.warn(`[mq:producer:response][RESOLVED] ${JSON.stringify(msg)}`);
      return res;
    }).catch((e) => {
      const error = e instanceof Error ? e : new Error(e.message || (typeof e === 'object' ? JSON.stringify(e) : e));
      this.Logger.warn(`[mq:producer:response][REJECTED] ${JSON.stringify(e.message)}`);
      return Promise.reject(e);
    });
  }

  listen(tags, handler) {
    assert(typeof handler === 'function', 'listener handler must be function');
    assert(this.isListen !== true, 'isListen cant add listener');
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
