'use strict';

angular.module('loyaltyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/createcardtype', {
        templateUrl: 'app/createcardtype/createcardtype.html',
        controller: 'CreateCardTypeCtrl'
      });
  });