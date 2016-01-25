'use strict';

angular.module('core').controller('HeaderController',
  ['$scope','Authentication', 'Menus', '$location',
  function($scope, Authentication, Menus, $location) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');

    $scope.toggleCollapsibleMenu = function() {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    $scope.signout = function() {
      Authentication.signout(function() {
        $location.path('/');
      });
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function() {
      $scope.isCollapsed = false;
    });
  }
]);
