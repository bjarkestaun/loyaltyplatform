'use strict';

angular.module('loyaltyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/signupmerchant', {
        templateUrl: 'app/signupmerchant/signupmerchant.html',
        controller: 'SignupMerchantCtrl'
      });
  });