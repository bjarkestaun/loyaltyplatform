'use strict';

angular.module('loyaltyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/usersignup', {
        templateUrl: 'app/usersignup/usersignup.html',
        controller: 'UserSignupCtrl'
      });
  });