'use strict';

angular.module('loyaltyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main2/main2.html',
        controller: 'Main2Ctrl',
        authenticate: true
      });
  });