const Server = require('./server');

Server.middleware = require('./middlewares');
Server.enum = require('./enums');
Server.Context = require('./classes/Context');

module.exports = Server;
