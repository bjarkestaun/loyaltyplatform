'use strict';

angular.module('loyaltyApp')
  .controller('Signin2Ctrl', function ($scope, $http, $window, socket, Auth, $location) {
  	$scope.user = {};
    $scope.errors = {};

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

  });
