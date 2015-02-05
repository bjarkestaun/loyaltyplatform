'use strict';

angular.module('loyaltyApp')
.factory('Merchant', function Merchant($location, $rootScope, $http, User, $cookieStore, $q, $log) {

  var merchant = null;

  return {

    createMerchant: function(newMerchant) {
      var deferred = $q.defer();
      $http({
      	method: 'POST',
      	url: '/api/merchants/',
      	headers: {'content-type': 'application/json'},
      	data: newMerchant
      	}).
      success(function(data) {
          deferred.resolve(data);
        }).error(function(msg, code) {
          deferred.reject(msg);
          $log.error(msg, code);
        });
      return deferred.promise;
    },

    getMerchant: function() {
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
    },

    getDecidedMerchant: function() {
      return merchant;
    },

    decideMerchant: function(thisMerchant) {
      merchant = thisMerchant;
    }

  };

});