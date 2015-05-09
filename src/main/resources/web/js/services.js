'use strict';

/* Services */

angular.module('myApp.services', [])
  .service('EventBusService', ['$timeout',
  function($timeout) {
    return {
        init: function(options) {
            var self = {};
            var openHandler = function() {
                if (self.registerHandlers) {
                    self.registerHandlers.forEach(function(registerHandler) {
                        self.bus.registerHandler(registerHandler.address, registerHandler.handler);
                    });
                }
                self.open();
                console.log('Connected to the server. ' + moment().format('YYYY-MM-DD HH:mm:ss'));
            };
            var closeHandler = function() {
                self.close();
                self.bus = null;
                $timeout(function() {
                    console.log('Retry to connect to the server...');
                    if (!self.bus) {
                        connect();
                    }
               }, self.intervalInMillis);
            };
            var connect = function() {
                self.bus = new vertx.EventBus(self.url);
                self.bus.onopen = openHandler;
                self.bus.onclose = closeHandler;
            };
            self.url = options.url;
            self.registerHandlers = options.registerHandlers || [];
            self.intervalInMillis = options.intervalInMillis || 10000;
            self.open = options.open || function () {};
            self.close = options.close || function () {};
            connect();
            return {
                send: function(address, message, reply) {
                    try {
                        self.bus.send(address, message, reply);
                    } catch (e) {
                        console.log(e);
                    }
                },
                publish: function(address, message) {
                    try {
                        self.bus.publish(address, message);
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }
    };
  }])
  .service('GraphService', [
  function() {
    return {
        init: function(options) {
            var self = {};
            var container = document.getElementById(options.containerId);
            self.graphOptions = options.graphOptions || {};
            self.dataSet = new vis.DataSet(options.dataSetInitValue || {});
            self.groups = options.groups || [];
            self.mergedOptions = angular.extend({}, {legend: true}, self.graphOptions);
            self.graph = new vis.Graph2d(container, self.dataSet, self.mergedOptions, new vis.DataSet(self.groups));
            return {
                dataSet: self.dataSet,
                graph: self.graph,
                addData: function(data) {
                    this.dataSet.add(data);
                },
                moveTo: function(time) {
                    this.graph.moveTo(time, this.graphOptions);
                }
            };
        }
    };
  }]);
