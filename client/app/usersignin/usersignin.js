'use strict';

angular.module('loyaltyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/usersignin', {
        templateUrl: 'app/usersignin/usersignin.html',
        controller: 'UserSigninCtrl'
      });
  });