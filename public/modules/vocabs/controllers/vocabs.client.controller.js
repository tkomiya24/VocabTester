'use strict';

// Vocabs controller
angular.module('vocabs').controller('VocabsController',
  ['$scope', '$stateParams', '$location', 'Authentication', 'Vocabs',
  function($scope, $stateParams, $location, Authentication, Vocabs) {
    $scope.authentication = Authentication;

    // Remove existing Vocab
    $scope.remove = function(vocab) {
      if (vocab) {
        vocab.$remove();

        for (var i in $scope.vocabs) {
          if ($scope.vocabs [i] === vocab) {
            $scope.vocabs.splice(i, 1);
          }
        }
      } else {
        $scope.vocab.$remove(function() {
          $location.path('vocabs');
        });
      }
    };

    // Update existing Vocab
    $scope.update = function() {
      var vocab = $scope.vocab;

      vocab.$update(function() {
        $location.path('vocabs/' + vocab._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Vocabs
    $scope.find = function() {
      $scope.vocabs = Vocabs.query();
    };

    // Find existing Vocab
    $scope.findOne = function() {
      $scope.vocab = Vocabs.get({
        vocabId: $stateParams.vocabId
      });
    };
  }
]);
