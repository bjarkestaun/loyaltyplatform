'use strict';

angular.module('loyaltyApp')
.controller('MerchantMainCtrl', function ($scope, $http, $window, $routeParams, socket, Auth, $location, $cookieStore, User, Merchant) {

  var currentUser = {};
  if($cookieStore.get('token')) {
    User.get(function(currentUser) {
      });
  };

  var init = function() {
    Merchant.getMerchant().then( function(payload) {
      $scope.merchantList = payload.data;
      if($scope.merchantList.length === 1) {
        $scope.merchantInfo = $scope.merchantList[0];
        $scope.oneMerchant = true;
      }
      else {
        $scope.oneMerchant = false;
      }
    },
    function(errorPayload) {
      $scope.error = true;
    });
  };

  $scope.chooseMerchant = function(merchantIndex) {
    $scope.merchantInfo = $scope.merchantList[merchantIndex];
    $scope.oneMerchant = true;
  };

  $scope.goToCreateCardType = function() {
    $location.path('/createcardtype').search({merchant_id: $scope.merchantInfo._id});
  };

  $scope.logout = function() {
    Auth.logout();
    $location.path('/signin2');
  };

  init();

});
