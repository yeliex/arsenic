const Server = require('./src/server/index');

Server.Context = require('./src/classes/context/index');
Server.Router = require('./src/classes/router/index');
Server.Sequelize = require('sequelize');
Server.Sequelize.public = require('./src/plugins/db/mysql/public');
Server.Utils = {
  traceId: require('./src/libs/utils/trace/index')
};

Server.fetch = require('./src/libs/request/index');

module.exports = Server;
