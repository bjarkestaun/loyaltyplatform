'use strict';

angular.module('loyaltyApp')
  .controller('WelcomeCtrl', function ($scope, $location) {
    
    $scope.doSignin = function() {
      $location.path('/signin2');
    };

    $scope.doSignup = function() {
      $location.path('/signup2');
    };

  });
