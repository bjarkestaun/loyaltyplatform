'use strict';

angular.module('loyaltyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/signup2', {
        templateUrl: 'app/signup2/signup2.html',
        controller: 'Signup2Ctrl'
      });
  });