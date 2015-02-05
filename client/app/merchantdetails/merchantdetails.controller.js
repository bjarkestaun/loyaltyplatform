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
    if (!$scope.merchantInfo) {
      $location.path('/usermain');
    }
    else {
      InfoForUser.getCardTypes($scope.merchantInfo).then( function(payload) {
        $scope.cardTypeList = payload.data;
        console.log($scope.cardTypeList);
      }, function(errorPayload) {
        $scope.error = true;
      });
    }
  };

$scope.requestPoint = function(cardType) {
  if (!cardType.card) {
    console.log('no card yet');
    InfoForUser.createCard(cardType._id).then( function(payload) {
      console.log('creates card');
      InfoForUser.requestEvent(payload._id);
    });
  }
  else {
    console.log('card exists');
    console.log(cardType.card);
    InfoForUser.requestEvent(cardType.card._id);
  }
  
/*  InfoForUser.getMyCards(1).then( function(payload) {
    $scope.myCards = payload.data;
    InfoForUser.createCard(cardType._id).then( function(payload) {
      InfoForUser.requestEvent(payload._id).then( function(payload) {},
        function(errorPayload) {
          $scope.error = true;
        });
    }, function(errorPayload) {
      $scope.error = true;
    });
  }); */


};

$scope.logout = function() {
  Auth.logout();
  $location.path('/usersignin');
};

init();

});
