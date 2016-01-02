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

    }
  ]);
