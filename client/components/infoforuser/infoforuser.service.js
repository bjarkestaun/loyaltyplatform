'use strict';

angular.module('loyaltyApp')
.factory('InfoForUser', function Merchant($location, $rootScope, $http, User, $cookieStore, $q, $log) {

  var merchant;

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

    searchMerchants: function(coords) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: 'api/users/me/merchants/search',
        headers: {'content-type': 'application/json'},
        data: coords
      }).
      success(function(data) {
        deferred.resolve(data);
      }).error(function(msg, code) {
        deferred.reject(msg);
        $log.error(msg, code);
      });
      return deferred.promise;
    },

    getMerchantDetails: function() {
      return merchant;
    },

    setMerchantDetails: function(thisMerchant) {
      merchant = thisMerchant;
    },

    getCardTypes: function(thisMerchant) {
      var deferred = $q.defer();
      $http.get('/api/users/me/merchants/cardtypes/' + thisMerchant._id)
      .success( function(data) {
        deferred.resolve({
          data: data
        });
      }).error( function(msg, code) {
        deferred.reject(msg);
      });
      return deferred.promise;
    },

    getMyCards: function(status) {
      var deferred = $q.defer();
      $http.get('/api/users/me/cards/status/' + status)
      .success( function(data) {
        deferred.resolve({
          data: data
        });
      }).error( function(msg, code) {
        deferred.reject(msg);
      });
      return deferred.promise;
    },

    getMerchantCards: function(thisMerchant) {
      var deferred = $q.defer();
      $http.get('/api/users/me/merchants/cards/' + thisMerchant._id)
      .success( function(data) {
        deferred.resolve({
          data: data
        });
      }).error( function(msg, code) {
        deferred.reject(msg);
      });
      return deferred.promise;
    },

    getCardsWithCardTypes: function(thisMerchant) {
      var deferred = $q.defer();
      $http.get('/api/users/me/merchants/cardtypeswithcards/' + thisMerchant._id)
      .success( function(data) {
        deferred.resolve({
          data: data
        });
      }).error( function(msg, code) {
        deferred.reject(msg);
      });
      return deferred.promise;
    },

    createCard: function(cardType_id) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/users/me/cards',
        headers: {'content-type': 'application/json'},
        data: { cardType_id: cardType_id }
      }).
      success(function(data) {
        console.log('creates card');
        deferred.resolve(data);
      }).error(function(msg, code) {
        deferred.reject(msg);
        $log.error(msg, code);
      });
      return deferred.promise;
    },

    requestEvent: function(cardId) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/users/me/cards/' + cardId + '/event',
        headers: {'content-type': 'application/json'},
      }).
      success(function(data) {
        console.log('event succeeded');
        deferred.resolve(data);
      }).error(function(msg, code) {
        deferred.reject(msg);
        $log.error(msg, code);
      });
      return deferred.promise;
    }

  };

});