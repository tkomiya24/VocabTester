'use strict';

// Vocablists controller
angular.module('vocablists').
  controller('VocablistsController',
    ['$scope', '$stateParams', '$location', 'Authentication', 'Vocablists',
      function($scope, $stateParams, $location, Authentication, Vocablists) {

        var finished = {};

        function isFinished(i) {
          return finished[i];
        }

        function markFinished(i) {
          finished[i] = true;
        }

        function guessIsCorrect(i) {
          return $scope.responses[i] === $scope.vocablist.vocab[i].korean.translation;
        }

        function markCorrect(i) {
          $scope.grades[i] = true;
          $scope.grade++;
          $scope.vocablist.vocab[i].korean.timesCorrect++;
        }

        function gradeQuestion(i) {
          if (isFinished(i)) {
            return;
          }
          if (guessIsCorrect(i)) {
            markCorrect(i);
            markFinished(i);
          }
          $scope.vocablist.vocab[i].korean.timesTested++;
        }

        $scope.authentication = Authentication;

        // Create new Vocablist
        $scope.create = function() {
          // Create new Vocablist object
          var vocablist = new Vocablists({
            name: this.name
          });

          // Redirect after save
          vocablist.$save(function(response) {
            $location.path('vocablists/' + response._id);

            // Clear form fields
            $scope.name = '';
          }, function(errorResponse) {
            $scope.error = errorResponse.data.message;
          });
        };

        // Remove existing Vocablist
        $scope.remove = function(vocablist) {
          if (vocablist) {
            vocablist.$remove();

            for (var i in $scope.vocablists) {
              if ($scope.vocablists [i] === vocablist) {
                $scope.vocablists.splice(i, 1);
              }
            }
          } else {
            $scope.vocablist.$remove(function() {
              $location.path('vocablists');
            });
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
          $scope.vocablists = Vocablists.query();
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
        };

        $scope.restartTest = function() {
          $scope.testIsFinished = false;
          $scope.grades = [];
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
      }
]);
