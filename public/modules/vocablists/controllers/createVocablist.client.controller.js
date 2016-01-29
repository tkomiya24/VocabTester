'use strict';

angular.module('vocablists').
  controller('CreateVocablistController',
    ['$scope', '$stateParams', '$location', 'Authentication', 'Vocablists', 'Category',
    function($scope, $stateParams, $location, Authentication, Vocablists, Category) {

      $scope.vocablist = new Vocablists();
      $scope.vocablist.vocab = [];
      $scope.categories = [];

      for (var property in Category) {
        if (Category.hasOwnProperty(property)) {
          $scope.categories.push(Category[property]);
        }
      }

      $scope.addVocab = function() {
        $scope.vocablist.vocab.push({});
      };

      $scope.create = function() {
        $scope.vocablist.$create(null,
          function(vocablist) {
            $location.path('vocablists/list');
          },
          function(response) {
            if (typeof response === 'object') {
              $scope.error = JSON.stringify(response);
            } else {
              $scope.error = response;
            }
          });
      };

      $scope.removeVocab = function(index) {
        $scope.vocablist.vocab.splice(index, 1);
      };
    }
  ]);
