'use strict';

// Vocablists controller
angular.module('vocablists').
  controller('flashcardTestController',
    ['$scope', '$stateParams', '$location', 'Authentication', 'Vocablists', 'Vocabs',
      function($scope, $stateParams, $location, Authentication, Vocablists, Vocabs) {
        //local variables
        var vocablist;
        var completed = [];

        function shuffle(a) {
          var j;
          var x;
          var i;
          for (i = a.length; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
          }
        }

        vocablist = Vocablists.get(
          {
            vocablistId: $stateParams.vocablistId
          },
          function(value, responseHeaders) {
            if (value.user !== Authentication.currentUser()._id) {
              $scope.authenticationError = 'You are not authorized to use this vocablist';
            } else {
              shuffle(value.vocab);
              $scope.currentVocab = value.vocab[value.vocab.length - 1];
              $scope.length = value.vocab.length;
            }
          }
        );

        //scope variables.
        $scope.inputAnswer = '';
        $scope.finished = false;
        $scope.correct = true;
        $scope.correctAnswer = '';
        $scope.score = 0;
        function getNextVocab() {
          if (1 >= vocablist.vocab.length) {
            $scope.finished = true;
          } else {
            completed.push(vocablist.vocab.pop());
            return vocablist.vocab[vocablist.vocab.length - 1];
          }
        }

        //scope methods
        $scope.validateAnswer = function(giveup) {
          if ($scope.currentVocab.translation ===
              $scope.inputAnswer) {
            $scope.currentVocab = getNextVocab();
            $scope.score++;
            $scope.inputAnswer = '';
          } else {
            $scope.correctAnswer = $scope.currentVocab.translation;
            $scope.correct = false;
          }
        };

        $scope.wrongHandler = function() {
          $scope.correct = true;
          $scope.inputAnswer = '';
          shuffle(vocablist.vocab);
          $scope.currentVocab = vocablist.vocab[vocablist.vocab.length - 1];
        };

        $scope.reset = function() {
          $scope.correct = true;
          $scope.inputAnswer = '';
          $scope.finished = false;
          vocablist.vocab = vocablist.vocab.concat(completed);
          completed = [];
          $scope.score = 0;
          shuffle(vocablist.vocab);
          $scope.currentVocab = vocablist.vocab[vocablist.vocab.length - 1];
        };

        $scope.inputEnter = function() {
          if ($scope.correct) {
            $scope.validateAnswer(false);
          } else {
            $scope.wrongHandler();
          }
        };
      }
]);
