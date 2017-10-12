module.exports = {
  appenders: {
    console: {
      type: 'console'
    },
    'access-api': {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd'
    },
    'access-static': {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd'
    },
    'api-data': {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd'
    },
    app: {
      console: true,
      type: 'dateFile',
      pattern: '-yyyy-MM-dd'
    },
    error: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd',
      console: true
    },
    fetch: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd'
    },
    mq: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd'
    },
    // request log for ali logger
    request: {
      type: 'dateFile',
      layout: { type: 'messagePassThrough' },
      pattern: '-yyyy-MM-dd'
    }
  }
};
