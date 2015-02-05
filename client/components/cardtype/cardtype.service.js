'use strict';

angular.module('loyaltyApp')
.factory('CardType', function CardType($location, $rootScope, $http, User, $cookieStore, $q, $log) {

  return {

    createCardType: function(newCardType) {
      console.log(newCardType);
      var deferred = $q.defer();
      $http({
      	method: 'POST',
      	url: '/api/merchants/me/cardtypes',
      	headers: {'content-type': 'application/json'},
      	data: newCardType
      	}).
      success(function(data) {
          deferred.resolve({});
        }).error(function(msg, code) {
          deferred.reject(msg);
          $log.error(msg, code);
        });
      return deferred.promise;
  },

/*  getMerchant: function() {
  	var deferred = $q.defer();
  	$http.get('/api/merchants/me')
  	.success(function(data) {
  		deferred.resolve({
  			data: data
  		});
  	}).error(function(msg, code) {
  		deferred.reject(msg);
  	});
  	return deferred.promise;
  } */
};

});