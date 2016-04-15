'use strict';

// Vocablists controller
angular.module('vocabs').
  controller('VocabsController',
    ['$scope', '$stateParams', '$location', 'Authentication', 'Vocabs',
      function($scope, $stateParams, $location, Authentication, Vocabs) {
        $scope.find = function() {
          $scope.vocabs = Vocabs.query();
        };
      }
]);
