const Server = require('./server');

Server.Context = require('./classes/context');
Server.Router = require('./classes/router');
Server.Sequelize = require('sequelize');
Server.Sequelize.public = require('./plugins/db/mysql/public');

module.exports = Server;
