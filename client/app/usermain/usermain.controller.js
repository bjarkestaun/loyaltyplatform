'use strict';

angular.module('loyaltyApp')
.controller('UserMainCtrl', function ($scope, $http, $window, $routeParams, socket, Auth, $location, $cookieStore, User, InfoForUser) {

  var currentUser = {};
  if($cookieStore.get('token')) {
    User.get(function(currentUser) {
      });
  };

  var init = function() {
    InfoForUser.getMerchants().then( function(payload) {
      $scope.merchantList = payload.data;
    },
    function(errorPayload) {
      $scope.error = true;
    });
  };

  $scope.chooseMerchant = function(merchantIndex) {
    InfoForUser.setMerchantDetails($scope.merchantList[merchantIndex]);
    $location.path('/merchantdetails').search({merchant_id: $scope.merchantList[merchantIndex]._id});
  };

  $scope.logout = function() {
    Auth.logout();
    $location.path('/usersignin');
  };

  init();

});
