'use strict';

angular.module('loyaltyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/usermain/usermain.html',
        controller: 'UserMainCtrl'
      });
  });