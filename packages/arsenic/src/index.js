const Server = require('./server/index');

Server.Context = require('./classes/context/index');
Server.Router = require('./classes/router/index');
Server.Sequelize = require('sequelize');
Server.Sequelize.public = require('./plugins/db/mysql/public');
Server.Utils = {
  traceId: require('./libs/utils/trace/index')
};

Server.fetch = require('./libs/request/index');

module.exports = Server;
