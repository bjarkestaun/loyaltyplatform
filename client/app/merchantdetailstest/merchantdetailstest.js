'use strict';

angular.module('loyaltyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/merchantdetailstest/', {
        templateUrl: 'app/merchantdetailstest/merchantdetailstest.html',
        controller: 'MerchantDetailsTestCtrl'
      });
  });