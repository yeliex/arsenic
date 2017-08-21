module.exports = {
  appenders: [
    {
      type: 'console'
    },
    {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd',
      category: 'access-api'
    },
    {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd',
      category: 'access-static'
    },
    {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd',
      category: 'api-data'
    },
    {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd',
      category: 'app'
    },
    {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd',
      category: 'error'
    },
    {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd',
      category: 'fetch'
    }
  ]
};
