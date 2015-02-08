'use strict';

angular.module('loyaltyApp')
.controller('MerchantMainCtrl', function ($scope, $http, $window, $routeParams, Auth, $location, $cookieStore, User, Merchant) {

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
      else if (Merchant.getDecidedMerchant()) {
        $scope.merchantInfo = Merchant.getDecidedMerchant();
      }
      else if ($scope.merchantList.length === 1) {
        $scope.merchantInfo = $scope.merchantList[0];
        Merchant.decideMerchant($scope.merchantInfo);
        $scope.oneMerchant = true;
      }
      else {
        $location.path('/multiplemerchants');
      }
    },
    function(errorPayload) {
      $scope.error = true;
    });
  };

  $scope.chooseDifferentMerchant = function() {
    $location.path('multiplemerchants');
  };

  $scope.goToCreateCardType = function() {
    $location.path('/createcardtype');
  };

  $scope.logout = function() {
    Auth.logout();
    $location.path('/signin2');
  };

  init();

});
