const Server = require('./server');

Server.Context = require('./classes/context');
Server.Router = require('./classes/router');
Server.Sequelize = require('sequelize');
Server.Sequelize.public = require('./plugins/db/mysql/public');
Server.Utils = {
  traceId: require('./libs/utils/trace')
};

Server.fetch = require('./libs/request/index');

module.exports = Server;
