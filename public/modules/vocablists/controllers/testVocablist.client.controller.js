'use strict';

// Vocablists controller
angular.module('vocablists').
  controller('TestController',
    ['$scope', '$stateParams', '$location', 'Authentication', 'Vocablists',
      function($scope, $stateParams, $location, Authentication, Vocablists) {

        $scope.vocablist = Vocablists.get({
          vocablistId: $stateParams.vocablistId
        });
        $scope.isSubmitted = false;
        $scope.responses = [];
        $scope.grades = [];
        $scope.grade = 0;
        for (var i = 0; i < $scope.vocablist.length; i++) {
          $scope.grades[i] = false;
        }
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

        $scope.test = function() {
          $scope.isSubmitted = false;
          $scope.findOne();
          $scope.responses = [];
          $scope.grades = [];
          $scope.grade = 0;
          for (var i = 0; i < $scope.vocablist.length; i++) {
            $scope.grades[i] = false;
          }
        };

        $scope.restartTest = function() {
          $scope.isSubmitted = false;
          $scope.grades = [];
          $scope.responses = [];
          $scope.finished = {};
        };

        $scope.retestIncorrect = function() {
          $scope.isSubmitted = false;
          $scope.responses = [];
        };

        $scope.gradeTest = function() {
          $scope.isSubmitted = true;
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
          return !$scope.isSubmitted && !$scope.grades[index];
        };

      }
]);
