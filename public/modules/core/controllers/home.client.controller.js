'use strict';

angular.module('core').controller('HomeController', ['$scope', '$location','Authentication',
  function($scope, $location, Authentication) {
    // This provides Authentication context.
    if (Authentication.user) {
      $location.path('/vocablists');
    }
    $scope.authentication = Authentication;
  }
]);
