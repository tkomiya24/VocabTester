'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$location', '$rootScope',
  function($location, $rootScope) {
    var _this = this;

    _this._data = {
      user: window.user,
      redirectUnauthenticated: function() {
        if (!window.user) {
          $rootScope.authenticationMessage = 'Sorry, you must be signed in to view that page';
          $location.path('/signin');
        }
      }
    };

    return _this._data;
  }
]);
