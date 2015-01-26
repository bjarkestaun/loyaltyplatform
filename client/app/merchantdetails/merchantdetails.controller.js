'use strict';

angular.module('loyaltyApp')
.controller('MerchantDetailsCtrl', function ($scope, $http, $window, $routeParams, socket, Auth, $location, $cookieStore, User, InfoForUser) {

  var currentUser = {};
  if($cookieStore.get('token')) {
    User.get(function(currentUser) {
      });
  };

  var init = function() {
    $scope.merchantInfo = InfoForUser.getMerchantDetails();
  };

  $scope.logout = function() {
    Auth.logout();
    $location.path('/usersignin');
  };

  init();

});
