'use strict';

// Vocablists controller
angular.module('vocablists').
  controller('TestController',
    ['$scope', '$stateParams', '$location', 'Authentication', 'Vocablists', 'Vocabs',
      function($scope, $stateParams, $location, Authentication, Vocablists, Vocabs) {

        if (!Authentication.currentUser()) {
          $location.path('/');
          return;
        }
        $scope.vocablist = Vocablists.get(
          {
            vocablistId: $stateParams.vocablistId
          },
          function(value, responseHeaders) {
            if (value.user !== Authentication.currentUser()._id) {
              $scope.authenticationError = 'You are not authorized to use this vocablist';
            }
          }
        );
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
          Vocabs.updateMultiple(
            null,
            $scope.vocablist.vocab,
            function(value, responseHeaders) {

            },
            function(httpResponse) {
              $scope.error = httpResponse.message;
            });
        };

        $scope.isTextFieldEnabled = function(index) {
          return !$scope.isSubmitted && !$scope.grades[index];
        };

      }
]);
