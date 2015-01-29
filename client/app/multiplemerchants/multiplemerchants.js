'use strict';

angular.module('loyaltyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/multiplemerchants', {
        templateUrl: 'app/multiplemerchants/multiplemerchants.html',
        controller: 'MultipleMerchantsCtrl'
      });
  });