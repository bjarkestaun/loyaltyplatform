'use strict';

angular.module('loyaltyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/welcome', {
        templateUrl: 'app/welcome/welcome.html',
        controller: 'WelcomeCtrl'
      });
  });