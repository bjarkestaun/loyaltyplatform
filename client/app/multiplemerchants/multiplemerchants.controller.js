'use strict';

angular.module('loyaltyApp')
.controller('MultipleMerchantsCtrl', function ($scope, $http, $window, $routeParams, Auth, $location, $cookieStore, User, Merchant) {

  var currentUser = {};
  if($cookieStore.get('token')) {
    User.get(function(currentUser) {
      });
  };

  var init = function() {
    Merchant.getMerchant().then( function(payload) {
      $scope.merchantList = payload.data;
      if ($scope.merchantList.length === 0) {
        $location.path('/signupmerchant');
      }
      else if ($scope.merchantList.length === 1) {
        $location.path('/merchantmain');
      }
    },
    function(errorPayload) {
      $scope.error = true;
    });
  };

  $scope.chooseMerchant = function(merchantIndex) {
    Merchant.decideMerchant($scope.merchantList[merchantIndex]);
    $location.path('/merchantmain');
  };

  $scope.logout = function() {
    Auth.logout();
    $location.path('/signin2');
  };

  init();

});
