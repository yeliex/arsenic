const Server = require('./server');

Server.Context = require('./classes/context');
Server.Router = require('./classes/router');
Server.Sequelize = require('sequelize');
Server.Sequelize.public = require('./plugins/sequelize/public');
Server.Middleware = require('./plugins/middleware');

module.exports = Server;
