'use strict';

angular.module('loyaltyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/usermain', {
        templateUrl: 'app/usermain/usermain.html',
        controller: 'UserMainCtrl'
      });
  });