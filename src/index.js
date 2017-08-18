const Server = require('./server');

Server.Context = require('./classes/context');
Server.Router = require('./classes/router');
Server.Logger = require('./plugins/logger');
Server.Sequelize = require('sequelize');
Server.Sequelize.public = require('./plugins/sequelize/public');
Server.fetch = require('./libs/request');
Server.Middleware = require('./plugins/middleware');

module.exports = Server;
