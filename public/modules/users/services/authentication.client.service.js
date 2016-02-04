'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication',
  ['$http', '$stateParams', '$rootScope',
  function($http, $stateParams, $rootScope) {
    function broadcastAuthentication(signedIn) {
      $rootScope.$broadcast('signinChange', signedIn);
    }
    var currentUser;
    return {
      signin: function(user, success, error) {
        $http.post('/auth/signin', user).success(function(response) {
          var expiryDate = new Date();
          expiryDate.setMonth(expiryDate.getMonth() + 6);
          currentUser = response;
          broadcastAuthentication(true);
          success();
        }).error(function(response) {
          error(response);
        });
      },
      signout: function(success, error) {
        $http.post('/auth/signout', {}).success(
          function(response) {
            broadcastAuthentication(false);
            currentUser = null;
            success();
          }).error(function(response) {
            error(response);
          });
      },
      signup: function(user, success, error) {
        $http.post('/auth/signup', user).success(function(response) {
          broadcastAuthentication(true);
          success();
        }).error(function(response) {
          error(response);
        });
      },
      currentUser: function() {
        return currentUser;
      },
      isAuthenticated: function(success, error) {
        $http.get('/auth/isauthenticated').
          success(function(response) {
            currentUser = response;
            broadcastAuthentication(!!currentUser);
            success(response);
          }).
          error(error);
      },
      requestPasswordReset: function(user, success, error) {
        $http.post('/auth/forgot', user).success(function(response) {
          success(response);
        }).error(function(response) {
          error(response);
        });
      },
      resetPassword: function(passwordDetails, success, error) {
        $http.post('/auth/reset/' + $stateParams.token, passwordDetails).
            success(function(response) {
              success(response);
            }).
            error(function(response) {
              error(response);
            });
      }
    };
  }
]);
