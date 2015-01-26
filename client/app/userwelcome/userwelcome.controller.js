'use strict';

angular.module('loyaltyApp')
  .controller('UserWelcomeCtrl', function ($scope, $location) {
    
    $scope.doSignin = function() {
      $location.path('/usersignin');
    };

    $scope.doSignup = function() {
      $location.path('/usersignup');
    };

  });
