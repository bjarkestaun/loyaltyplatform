'use strict';

angular.module('loyaltyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/signin2', {
        templateUrl: 'app/signin2/signin2.html',
        controller: 'Signin2Ctrl'
      });
  });