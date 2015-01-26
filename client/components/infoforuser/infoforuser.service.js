'use strict';

angular.module('loyaltyApp')
.factory('InfoForUser', function Merchant($location, $rootScope, $http, User, $cookieStore, $q, $log) {

  var merchant = {};

  return {

    getMerchants: function() {
      var deferred = $q.defer();
      $http.get('/api/users/me/merchants')
      .success(function(data) {
        deferred.resolve({
          data: data
        });
      }).error(function(msg, code) {
        deferred.reject(msg);
      });
      return deferred.promise;
    },

    getMerchantDetails: function() {
      return merchant;
    },

    setMerchantDetails: function(thisMerchant) {
      merchant = thisMerchant;
    }

  };

});