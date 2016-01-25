'use strict';

angular.module('core').controller('HomeController', ['$scope', '$location','Authentication',
  function($scope, $location, Authentication) {
    if (Authentication.currentUser()) {
      $location.path('/vocablists');
    }
  }
]);
