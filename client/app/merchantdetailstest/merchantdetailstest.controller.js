'use strict';

angular.module('loyaltyApp')
.controller('MerchantDetailsTestCtrl', function ($scope, $http, $window, $routeParams, Auth, $location, $cookieStore, User, InfoForUser) {

  var currentUser = {};
  if($cookieStore.get('token')) {
    User.get(function(currentUser) {
    });
  };

  var init = function() {
    $scope.merchantInfo = InfoForUser.getMerchantDetails();
    if (!$scope.merchantInfo) {
      $location.path('/usermaintest');
    }
    else {
      InfoForUser.getCardTypes($scope.merchantInfo).then( function(payload) {
        $scope.cardTypeList = payload.data;
      }, function(errorPayload) {
        $scope.error = true;
      });
      InfoForUser.getMerchantCards($scope.merchantInfo).then( function(payload) {
        $scope.cardList = payload.data;
        console.log($scope.cardList);
      }, function(errorPayload) {
        $scope.error = true;
      });
    }
  };

  $scope.requestCard = function(cardType) {
    console.log(cardType);
    InfoForUser.createCard(cardType._id).then( function(payload) {
      InfoForUser.getMerchantCards($scope.merchantInfo).then( function(payload) {
        $scope.cardList = payload.data;
        console.log($scope.cardList);
      }, function(errorPayload) {
        $scope.error = true;
      });
      console.log('creates card');
    });
  };

  $scope.requestEvent = function(card) {
    InfoForUser.requestEvent(card._id).then( function(payload) {
      InfoForUser.getMerchantCards($scope.merchantInfo).then( function(payload) {
        $scope.cardList = payload.data;
        console.log($scope.cardList);
      }, function(errorPayload) {
        $scope.error = true;
      });
      console.log('requests point');
    });
  };

$scope.logout = function() {
  Auth.logout();
  $location.path('/usersignin');
};

init();

});
