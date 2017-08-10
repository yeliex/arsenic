const Server = require('./server');

Server.middleware = require('./middlewares');
Server.enum = require('./enums');

module.exports = Server;
