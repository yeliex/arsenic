const Server = require('./server');

Server.Context = require('./classes/context');
Server.Router = require('./classes/router');
Server.Logger = require('./loaders/logger');

module.exports = Server;
