'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication',
  ['$http', '$cookies', '$stateParams', '$rootScope',
  function($http, $cookies, $stateParams, $rootScope) {
    function broadcastAuthentication(signedIn) {
      $rootScope.$broadcast('signinChange', signedIn);
    }
    return {
      signin: function(user, success, error) {
        $http.post('/auth/signin', user).success(function(response) {
          var expiryDate = new Date();
          expiryDate.setMonth(expiryDate.getMonth() + 6);
          $cookies.putObject('user', response, {
            expires: expiryDate
          });
          broadcastAuthentication(true);
          success();
        }).error(function(response) {
          error(response);
        });
      },
      signout: function(success, error) {
        $http.post('/auth/signout', {}).success(
          function(response) {
            $cookies.remove('user');
            broadcastAuthentication(false);
            success();
          }).error(function(response) {
            error(response);
          });
      },
      signup: function(user, success, error) {
        $http.post('/auth/signup', user).success(function(response) {
          $cookies.putObject('user', response);
          broadcastAuthentication(true);
          success();
        }).error(function(response) {
          error(response);
        });
      },
      currentUser: function() {
        return $cookies.getObject('user');
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
