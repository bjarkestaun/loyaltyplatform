'use strict';

angular.module('loyaltyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/merchantdetails/', {
        templateUrl: 'app/merchantdetails/merchantdetails.html',
        controller: 'MerchantDetailsCtrl'
      });
  });