'use strict';

// Vocablists controller
angular.module('vocablists').
  controller('VocablistsController',
    ['$scope', '$stateParams', '$location', 'Authentication', 'Vocablists',
      function($scope, $stateParams, $location, Authentication, Vocablists) {

        $scope.finished = {};

        function isFinished(i) {
          return $scope.finished[i];
        }

        function markFinished(i) {
          $scope.finished[i] = true;
        }

        function guessIsCorrect(i) {
          return $scope.responses[i] === $scope.vocablist.vocab[i].translation;
        }

        function markCorrect(i) {
          $scope.grades[i] = true;
          $scope.grade++;
          $scope.vocablist.vocab[i].timesCorrect++;
        }

        function gradeQuestion(i) {
          if (isFinished(i)) {
            return;
          }
          if (guessIsCorrect(i)) {
            markCorrect(i);
            markFinished(i);
          }
          $scope.vocablist.vocab[i].timesTested++;
        }

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
          var vocablist = $scope.vocablist;

          vocablist.$update(function() {
            $location.path('vocablists/' + vocablist._id);
          }, function(errorResponse) {
            $scope.error = errorResponse.data.message;
          });
        };

        $scope.test = function() {
          $scope.testIsFinished = false;
          $scope.findOne();
          $scope.responses = [];
          $scope.grades = [];
          $scope.grade = 0;
          for (var i = 0; i < $scope.vocablist.length; i++) {
            $scope.grades[i] = false;
          }
        };

        // Find a list of Vocablists
        $scope.find = function() {
          $scope.vocablists = Vocablists.query({userId: $scope.authentication.user._id});
          $scope.selectedVocablist = {};
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

        $scope.restartTest = function() {
          $scope.testIsFinished = false;
          $scope.grades = [];
          $scope.responses = [];
          $scope.finished = {};
        };

        $scope.retestIncorrect = function() {
          $scope.testIsFinished = false;
          $scope.responses = [];
        };

        $scope.gradeTest = function() {
          $scope.testIsFinished = true;
          for (var i = 0; i < $scope.vocablist.vocab.length; i++) {
            gradeQuestion(i);
          }
          $scope.vocablist.$update(
            null,
            function(vocablist) {
              $scope.vocablist = vocablist;
            },
            function(errorResponse) {
              $scope.error = errorResponse.data.message;
            });
        };

        $scope.isTextFieldEnabled = function(index) {
          return !$scope.testIsFinished && !$scope.grades[index];
        };

        $scope.addVocab = function() {
          $scope.vocablist.vocab.push({});
        };
      }
]);
