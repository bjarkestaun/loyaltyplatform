'use strict';

angular.module('loyaltyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/merchantmain', {
        templateUrl: 'app/merchantmain/merchantmain.html',
        controller: 'MerchantMainCtrl'
      });
  });