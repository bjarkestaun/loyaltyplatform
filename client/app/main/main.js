'use strict';

angular.module('loyaltyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/biarge', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });