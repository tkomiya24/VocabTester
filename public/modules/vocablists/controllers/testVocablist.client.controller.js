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
        $scope.grade = 0;
        for (var i = 0; i < $scope.vocablist.length; i++) {
          $scope.grades[i] = false;
        }

        function isFinished(i) {
          return !!$scope.vocablist.vocab[i].correct;
        }

        function guessIsCorrect(i) {
          return $scope.responses[i] === $scope.vocablist.vocab[i].translation;
        }

        function markCorrect(i) {
          $scope.grade++;
          $scope.vocablist.vocab[i].timesCorrect++;
          $scope.vocablist.vocab[i].correct = true;
        }

        function gradeQuestion(i) {
          if (isFinished(i)) {
            return;
          }
          if (guessIsCorrect(i)) {
            markCorrect(i);
          }
          $scope.vocablist.vocab[i].timesTested++;
        }

        function resetMarkers() {
          for (var i = 0; i < $scope.vocablist.vocab.length; i++) {
            delete $scope.vocablist.vocab[i].correct;
          }
        }

        $scope.restartTest = function() {
          $scope.isSubmitted = false;
          $scope.responses = [];
          resetMarkers();
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
      }
]);
