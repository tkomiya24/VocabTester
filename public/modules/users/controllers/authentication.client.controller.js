'use strict';

angular.module('users').controller('AuthenticationController',
  ['$scope', '$location', 'Authentication',
  function($scope, $location, Authentication) {

    // If user is signed in then redirect back home
    if (Authentication.currentUser()) {
      console.log(Authentication.currentUser());
      $location.path('/');
    }

    $scope.signup = function() {
      Authentication.signup($scope.credentials, function() {
        $location.path('/');
      }, function(response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function() {
      Authentication.signin($scope.credentials, function() {
        $location.path('/');
      }, function(response) {
        $scope.error = response.message;
      });
    };
  }
]);
