const Server = require('./server');

Server.Context = require('./classes/context');
Server.Router = require('./classes/router');
Server.Logger = require('./loaders/logger');
Server.Sequelize = require('sequelize');
Server.Sequelize.public = require('./loaders/sequelize/public');
Server.fetch = require('./libs/request');
Server.Middleware = require('./loaders/middleware');

module.exports = Server;
