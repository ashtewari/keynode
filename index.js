global.appsettings = require('nconf');
global.appsettings.file('settings.json');

var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.start;
handle["/issue"] = requestHandlers.issue;
handle["/validate"] = requestHandlers.validate;

server.start(router.route, handle);