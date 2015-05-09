'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('LoginCtrl', ['$scope', '$location', function($scope, $location) {
    $scope.moveToChat = function() {
      $location.path('/chat/' + $scope.userName);
    }
  }])
  .controller('ChatCtrl', ['$scope', '$routeParams', 'EventBusService', function($scope, $routeParams, EventBusService) {
    $scope.userName = $routeParams.userName;
    $scope.chatText = '';
    $scope.messages = [];

    var eventBus = EventBusService.init({
       url: 'http://localhost:11010/chat',
       registerHandlers: [
            { address: 'chat.all', handler: function(data) {
                console.log('received a message from "chat.all": ' + JSON.stringify(data));
                $scope.$apply(function() {
                    if (data) {
                        $scope.messages.push(data);
                        scrollToBottom();
                    }
                });
            }},
            { address: 'chat.' + $scope.userName, handler: function(data) {
                console.log('received a message from "chat.user": ' + JSON.stringify(data));
                $scope.$apply(function() {
                    if (data) {
                        $scope.messages.push(data);
                        scrollToBottom();
                    }
                });
            }}
       ],
       open: function () {
           $scope.$apply(function() {
               $scope.messages.push({userName: 'System', action: 'info', message: 'Connected', sentDate: new Date().toJSON()});
               scrollToBottom();
           });
       },
       close: function() {
            if ($scope.messages.length === 0 || $scope.messages[$scope.messages.length-1].action !== 'danger') {
                $scope.$apply(function() {
                    $scope.messages.push({userName: 'System', action: 'danger', message: 'Disconnected', sentDate: new Date().toJSON()});
                    scrollToBottom();
                });
            }
       }
    });

    $scope.publishMessage = function() {
        eventBus.publish('chat.all', {userName: $scope.userName, action: 'send', message: $scope.message, sentDate: new Date()});
        $scope.message = '';
    };

    $scope.sendMessage = function() {
        eventBus.send('chat.' + $scope.targetUser, {userName: $scope.userName, action: 'send', message: $scope.message, sentDate: new Date()});
        $scope.message = '';
    };

    function scrollToBottom() {
        if ($('#chat-table').height() > 300) {
            $('#chat-table').height(300);
        }
        $('#chat-table').animate({ scrollTop: $('#chat-table')[0].scrollHeight - 100}, 100);
    }
  }])
  .controller('MonitorCtrl', ['$scope', 'EventBusService', 'GraphService', function($scope, EventBusService, GraphService) {

    var heapStatusChart = GraphService.init({
        containerId: 'heap-status-chart',
        groups: [
            { id: 0, content: 'Total memory' },
            { id: 1, content: 'Free memory' },
            { id: 2, content: 'Used memory', options: { shaded: { orientation: 'bottom' }}}
        ],
        dataSetInitValue: {x: moment(), y: 0},
        graphOptions: {drawPoints: {enabled:false, size:3}, catmullRom: false, height: '250px', start: moment(), end: moment() + 60000 }
    });

    EventBusService.init({
       url: 'http://localhost:12010/monitor',
       registerHandlers: [
            { address: 'monitor.heap-status', handler: function(data) {
                console.log('Received a message: ' + JSON.stringify(data));
                var now = moment();
                heapStatusChart.addData([
                    {x: now, y: data.totalMem / 1000000, group: 0},
                    {x: now, y: data.freeMem / 1000000, group: 1},
                    {x: now, y: (data.totalMem - data.freeMem) / 1000000, group: 2}
                ]);
               heapStatusChart.moveTo(now - 25000);
            }}
       ]
    });

  }])
  .controller('GameCtrl', ['$scope', function($scope) {

  }])
  ;
