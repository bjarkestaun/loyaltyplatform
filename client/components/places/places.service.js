'use strict';

angular.module('loyaltyApp')
.factory('Places', function Places($http, $q) {

  return {
    getPlacesData: function() {
      var deferred = $q.defer();
      $http.get('/api/places/me')
        .success(function(data) {
          deferred.resolve({
            data: data
          });
        }).error(function(msg, code) {
          deferred.reject(msg);
        });
      return deferred.promise;
    }
  }

});