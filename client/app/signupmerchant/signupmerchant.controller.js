'use strict';

angular.module('loyaltyApp')
  .controller('SignupMerchantCtrl', function ($scope, $http, $window, socket, Auth, $location, Merchant) {
    
    $scope.merchant = {};
    $scope.errors = {};

    $scope.signupMerchant = function(merchant) {
      $scope.submitted = true;

      if ($scope.merchantForm.$valid) {
      	Merchant.createMerchant(merchant).then( function(payload) {
      		$scope.errorMessage = 'success';
      		$location.path('/merchantmain');
      	},
      	function(errorPayload) {
      		$scope.errorMessage = 'Merchant kunne ikke oprettes.';
      	});
      } else {
      	$scope.errorMessage = 'En eller flere indtastede oplysninger er ikke korrekte';
      }
    };
  });
