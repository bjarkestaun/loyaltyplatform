'use strict';

angular.module('loyaltyApp')
.controller('Main2Ctrl', function ($scope, $http, $window, socket, Auth, $location, $cookieStore, User, Places) {

  $scope.ready = false;

  var currentUser = {};
  if($cookieStore.get('token')) {
    User.get(function(currentUser) {
      console.log(currentUser);
      if (!currentUser.merchant_id) {
        $location.path('/signupmerchant');
      } else {
        $scope.ready = true;
      }
    });
  };

  var init = function() {

  };

  $scope.logout = function() {
    Auth.logout();
    $location.path('/signin2');
  };

  init();

});

