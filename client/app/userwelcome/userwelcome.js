'use strict';

angular.module('loyaltyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/userwelcome', {
        templateUrl: 'app/userwelcome/userwelcome.html',
        controller: 'UserWelcomeCtrl'
      });
  });