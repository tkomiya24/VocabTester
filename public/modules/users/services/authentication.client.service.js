'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication',
  ['$http', '$cookies', '$stateParams',
  function($http, $cookies, $stateParams) {
    return {
      signin: function(user, success, error) {
        $http.post('/auth/signin', user).success(function(response) {
          $cookies.putObject('user', response);
          success();
        }).error(function(response) {
          error(response);
        });
      },
      signout: function(success, error) {
        $http.post('/auth/signout', {}).success(
          function(response) {
            $cookies.remove('user');
            success();
          }).error(function(response) {
            error(response);
          });
      },
      signup: function(user, success, error) {
        $http.post('/auth/signup', user).success(function(response) {
          $cookies.putObject('user', response);
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
