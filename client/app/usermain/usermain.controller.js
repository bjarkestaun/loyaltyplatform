'use strict';

angular.module('loyaltyApp')
.controller('UserMainCtrl', function ($scope, $http, $window, $routeParams, Auth, $location, $cookieStore, User, InfoForUser, geolocation) {

  var currentUser = {};

/*
  if($cookieStore.get('token')) {
    User.get(function(currentUser) {
    });
  };
*/

  var init = function() {
    $scope.spinner = true;

    geolocation.getLocation().then(function(data){
      var distance = 10000000; //distance to search within - in meters
      $scope.coords = {
        lng: data.coords.longitude,
        lat: data.coords.latitude,
        distance: distance
      };

      $scope.searchWord = '';
      InfoForUser.searchMerchants($scope.coords).then( function(payload) {
        $scope.merchantList = payload;
        $scope.spinner = false;
      }, function(errorPayload) {
        $scope.error = true;
      });
    });


    var status = 1 //get active cards
    InfoForUser.getMyCards(1).then( function(payload) {
      $scope.cardList = payload.data;
      console.log($scope.cardList);
    }, function(errorPayload) {
      $scope.error = true;
    });

  };

  $scope.chooseMerchant = function(merchant) {
    InfoForUser.setMerchantDetails(merchant);
    $location.path('/merchantdetails');
  };

  $scope.logout = function() {
    Auth.logout();
    $location.path('/usersignin');
  };

  init();

});
