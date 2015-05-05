var vertx = require('vertx');
var console = require('vertx/console');
var container = require('vertx/container');
var http = require('vertx/http');
var eventBus = vertx.eventBus;
var config = container.config;

var httpServer = http.createHttpServer();
vertx.createSockJSServer(httpServer).bridge({prefix: '/chat'}, [{}], [{}]);
httpServer.listen(config.port, config.host, function(err) {
    if (err) {
        console.log('Unable to start a server: ' + err);
    } else {
        console.log('The [/chat] instance with host ['
            + config.host + ':' + config.port + '] has been started successfully');
    }
});
