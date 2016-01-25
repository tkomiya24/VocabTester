'use strict';

angular.module('core').controller('HeaderController',
  ['$scope','Authentication', 'Menus', '$location', '$http',
  function($scope, Authentication, Menus, $location, $http) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');

    $scope.toggleCollapsibleMenu = function() {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    $scope.signout = function() {
      $http.post('/auth/signout', $scope.credentials).success(
        function(response) {
          delete Authentication.user;
          $location.path('/');
        }).error(
        function(response) {
          $scope.error = 'There was an error. Could not sign out. ' + response;
        }
      );
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function() {
      $scope.isCollapsed = false;
    });
  }
]);
