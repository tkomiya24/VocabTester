'use strict';

// Vocablists controller
angular.module('vocablists').
  controller('VocablistsController',
    ['$scope', '$stateParams', '$location', 'Authentication', 'Vocablists',
      function($scope, $stateParams, $location, Authentication, Vocablists) {

        $scope.authentication = Authentication;

        // Remove existing Vocablist
        $scope.remove = function(vocablist, index) {
          if ($scope.selectedVocablist) {
            $scope.selectedVocablist.$remove(
              null,
              function(value, responseHeaders) {
                $scope.vocablists.splice($scope.currentIndex, 1);
                $scope.selectedVocablist = null;
                $scope.currentIndex = -1;
              },
              function(httpResponse) {
                $scope.error = JSON.stringify(httpResponse);
              }
            );
          }
        };

        // Update existing Vocablist
        $scope.update = function() {
          $scope.vocablist.$update(
            null,
            function(vocablist) {
              $scope.vocablist = vocablist;
            },
            function(errorResponse) {
              $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Vocablists
        $scope.find = function() {
          $scope.vocablists = Vocablists.query({userId: $scope.authentication.user._id});
        };

        // Find existing Vocablist
        $scope.findOne = function() {
          $scope.vocablist = Vocablists.get({
            vocablistId: $stateParams.vocablistId
          });
        };

        $scope.selectVocablist = function(index) {
          $scope.selectedVocablist = $scope.vocablists[index];
          $scope.currentIndex = index;
        };

        $scope.addVocab = function() {
          $scope.vocablist.vocab.push({});
        };

        $scope.removeVocab = function(index) {
          $scope.vocablist.vocab[index].deleted = true;
        };
      }
]);
