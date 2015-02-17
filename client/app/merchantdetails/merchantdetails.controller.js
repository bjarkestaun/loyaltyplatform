'use strict';

angular.module('loyaltyApp')
.controller('MerchantDetailsCtrl', function ($scope, $http, $window, $routeParams, Auth, $location, $cookieStore, User, InfoForUser) {

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
      InfoForUser.getCardTypesWithCards($scope.merchantInfo).then( function(payload) {
        $scope.cardTypesList = payload.data;
      }, function(errorPayload) {
        $scope.error = true;
      });
    }
  };

$scope.requestPoint = function(cardType) {
  if (!cardType.card_id) {
    InfoForUser.createCard(cardType._id).then( function(payload) {
      InfoForUser.requestEvent(payload._id).then( function(payload) {
        InfoForUser.getCardTypesWithCards($scope.merchantInfo).then( function(payload) {
          $scope.cardTypesList = payload.data;
        });
      });
    });
  }
  else {
    InfoForUser.requestEvent(cardType.card_id).then( function(payload) {
      InfoForUser.getCardTypesWithCards($scope.merchantInfo).then( function(payload) {
        $scope.cardTypesList = payload.data;
      });
    });
  }
};

$scope.logout = function() {
  Auth.logout();
  $location.path('/usersignin');
};

init();

});
