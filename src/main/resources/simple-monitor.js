var vertx = require('vertx');
var console = require('vertx/console');
var container = require('vertx/container');
var http = require('vertx/http');
var eventBus = vertx.eventBus;
var config = container.config;

var httpServer = http.createHttpServer();
vertx.createSockJSServer(httpServer).bridge({prefix: '/monitor'}, [{}], [{}]);
httpServer.listen(config.port, config.host, function(err) {
    if (err) {
        console.log('Unable to start a server: ' + err);
    } else {
        vertx.setPeriodic(1000, function(timerID) {
            var runtime = java.lang.Runtime.getRuntime();
            var heapStatus = {
                cores: runtime.availableProcessors(),
                freeMem: runtime.freeMemory(),
                maxMem: runtime.maxMemory(),
                totalMem: runtime.totalMemory(),
                date: new java.util.Date().toString()
            };
            eventBus.publish("monitor.heap-status", heapStatus);
            console.log('Published monitor.heap-status: ' + JSON.stringify(heapStatus));
        });

        console.log('The [/monitor] instance with host ['
            + config.host + ':' + config.port + '] has been started successfully');
    }
});