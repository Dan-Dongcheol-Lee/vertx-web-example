var console = require('vertx/console');
var container = require('vertx/container');
var config = container.config;

container.deployModule('io.vertx~mod-web-server~2.0.0-final', config.webServer.instances, config.webServer,
function(err, deployID) {
    if (!err) {
        console.log('The [mod-web-server] has been deployed, deployment ID is ' + deployID);
    } else {
        console.log('Deployment [mod-web-server] failed! ' + err.getMessage());
    }
});

container.deployVerticle("simple-chat.js", config.simpleChat.instances, config.simpleChat,
function(err, deployID) {
    if (!err) {
        console.log('The [simple-chat] has been deployed, deployment ID is ' + deployID);
    } else {
        console.log('Deployment [simple-chat] failed! ' + err.getMessage());
    }
});

container.deployVerticle("simple-monitor.js", config.simpleMonitor.instances, config.simpleMonitor,
function(err, deployID) {
    if (!err) {
        console.log('The [simple-monitor] has been deployed, deployment ID is ' + deployID);
    } else {
        console.log('Deployment [simple-monitor] failed! ' + err.getMessage());
    }
});