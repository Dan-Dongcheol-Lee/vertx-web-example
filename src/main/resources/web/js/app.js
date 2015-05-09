'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'ngResource',
  'myApp.services',
  'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
  $routeProvider.when('/chat/:userName', {templateUrl: 'partials/chat.html', controller: 'ChatCtrl'});
  $routeProvider.when('/monitor', {templateUrl: 'partials/monitor.html', controller: 'MonitorCtrl'});
//  $routeProvider.when('/game', {templateUrl: 'partials/game.html', controller: 'GameCtrl'});
  $routeProvider.otherwise({redirectTo: '/login'});
}]);
