'use strict';

angular.module('vocablists').
  controller('CreateVocablistController',
    ['$scope', '$stateParams', '$location', 'Authentication', 'Vocablists',
    function($scope, $stateParams, $location, Authentication, Vocablists) {

      $scope.vocablist = new Vocablists();
      $scope.vocablist.vocab = [];

      $scope.addVocab = function() {
        $scope.vocablist.vocab.push({word: 'Word', translation: 'Translation'});
      };

      $scope.create = function() {
        $scope.vocablist.$create(null, function() {},
          function(response) {
            if (typeof response === 'object') {
              $scope.error = JSON.stringify(response);
            } else {
              $scope.error = response;
            }
          });
      };
    }
  ]);
