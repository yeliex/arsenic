const RocketMQ = require('rocketmq');
const urllib = require('urllib');
const assert = require('assert');

class Topic {
  constructor(topic, config) {
    const { topic: topicName, consumer, producer, tags } = topic;

    this.Tags = tags;
    this.Topic = topicName;
    this.Listeners = {};

    if (consumer) {
      this.Comsumer = new RocketMQ.Consumer({
        comsumerGroup: consumer,
        namesrvAddr: config.namesrvAddr,
        urllib
      });

      this.Comsumer.subscribe(topicName, tags.join(' || '));

      this.Comsumer.on('message', this.dispatch);

      this.Comsumer.on('error', (err) => console.error(err.stack));
    }

    if (producer) {
      this.Producer = new RocketMQ.Producer({
        producerGroup: producer,
        namesrvAddr: config.namesrvAddr,
        urllib
      });
    }
  }

  dispatch(msg, ack) {
    console.log(msg, ack);
  }

  listen(tags, handler) {
    assert(typeof handler === 'function', 'listener handler must be function');
    tags = typeof tags === 'string' ? tags.replace(/ /g, '').split('||') : tags;
    tags.forEach((tag) => {
      if (this.Listeners[tag]) {
        throw new Error(`Duplicate listener: ${topic}=>${tag}`);
      }
      this.Listeners[tag] = {
        handler: handler
      };
    });
  }

  send(tag, body) {
    return new Promise((rec, rej) => {
      const message = new RocketMQ.Message(this.Topic, tag, body);
      this.Producer.ready(() => {
        this.Producer.send(msg, (err, res) => {
          if (err) {
            rej(err);
            return;
          }
          rec(res);
        });
      });
    });
  }
}
