'use strict';

angular.module('users').controller('PasswordController',
  ['$scope', '$stateParams', '$location', 'Authentication',
  function($scope, $stateParams, $location, Authentication) {
    //If user is signed in then redirect back home
    if (Authentication.currentUser()) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function() {
      $scope.success = $scope.error = null;
      Authentication.requestPasswordReset($scope.credentials, function(response) {
        $scope.credentials = null;
        $scope.success = response.message;
      }, function(response) {
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function() {
      $scope.success = $scope.error = null;

      Authentication.resetPassword(
        $scope.passwordDetails,
        function(response) {
          $scope.passwordDetails = null;
          $location.path('/password/reset/success');
        },
        function(response) {
          $scope.error = response.message;
        });
    };
  }
]);
