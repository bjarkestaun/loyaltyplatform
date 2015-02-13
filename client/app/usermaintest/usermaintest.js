'use strict';

angular.module('loyaltyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/usermaintest', {
        templateUrl: 'app/usermaintest/usermaintest.html',
        controller: 'UserMainTestCtrl'
      });
  });