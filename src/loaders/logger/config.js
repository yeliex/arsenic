module.exports = {
  appenders: [
    {
      type: 'console'
    },
    {
      type: 'dataFile',
      pattern: '-yyyy-MM-dd',
      category: 'access-api'
    },
    {
      type: 'dataFile',
      pattern: '-yyyy-MM-dd',
      category: 'access-static'
    },
    {
      type: 'dataFile',
      pattern: '-yyyy-MM-dd',
      category: 'app'
    },
    {
      type: 'dataFile',
      pattern: '-yyyy-MM-dd',
      category: 'error'
    },
    {
      type: 'dataFile',
      pattern: '-yyyy-MM-dd',
      category: 'fetch'
    }
  ]
};
