'use strict';

angular.module('loyaltyApp')
  .controller('CreateCardTypeCtrl', function ($scope, $http, $window, $routeParams, Auth, $location, Merchant, CardType) {
    
    $scope.merchant = {};
    $scope.cardType = {};
    $scope.errors = {};
    $scope.thisMerchant = Merchant.getDecidedMerchant();

    $scope.createCardType = function(cardType) {
      $scope.submitted = true;
      cardType.merchant_id = $scope.thisMerchant._id;
      if ($scope.cardTypeForm.$valid) {
      	CardType.createCardType(cardType).then( function(payload) {
      		$scope.errorMessage = 'success';
      		$location.path('/merchantmain');
      	},
      	function(errorPayload) {
      		$scope.errorMessage = 'Card type kunne ikke oprettes.';
      	});
      } else {
      	$scope.errorMessage = 'En eller flere indtastede oplysninger er ikke korrekte';
      }
    };
  });
