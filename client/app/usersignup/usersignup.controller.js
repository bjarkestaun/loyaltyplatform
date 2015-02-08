'use strict';

angular.module('loyaltyApp')
  .controller('UserSignupCtrl', function ($scope, $http, $window, Auth, $location) {
  	$scope.user = {};
    $scope.errors = {};

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    $scope.register = function(form) {
      $scope.submitted = true;

      console.log('trying to create account');

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Account created, redirect to merchant signup page
          console.log('account created');
          $location.path('/usermain');
        })
        .catch( function(err) {
          console.log('some error occured');
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

  });
