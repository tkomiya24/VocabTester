'use strict';

// Vocablists controller
angular.module('vocablists').
  controller('VocablistsController',
    ['$scope', '$stateParams', '$location', 'Authentication', 'Vocablists', 'Category',
      function($scope, $stateParams, $location, Authentication, Vocablists, Category) {
        $scope.user = Authentication.currentUser();
        $scope.categories = [];
        for (var property in Category) {
          if (Category.hasOwnProperty(property)) {
            $scope.categories.push(Category[property]);
          }
        }
        // Remove existing Vocablist
        $scope.remove = function(vocablist, index) {
          if (vocablist) {
            vocablist.$remove(
              null,
              function(value, responseHeaders) {
                $scope.vocablists.splice(index, 1);
              },
              function(httpResponse) {
                $scope.error = JSON.stringify(httpResponse);
              }
            );
          }
        };

        $scope.removeOne = function() {
          $scope.vocablist.$remove(
            null,
            function(value, responseHeaders) {
              $scope.message = 'Vocablist successfully deleted';
              $location.path('/vocablist');
            },
            function(httpResponse) {
              $scope.error = httpResponse.message;
            }
          );
        };

        // Update existing Vocablist
        $scope.update = function() {
          $scope.vocablist.$update(
            null,
            function(vocablist) {
              $location.path('/vocablist');
            },
            function(errorResponse) {
              $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Vocablists
        $scope.find = function() {
          var query = {limit: 10};
          $scope.vocablists = Vocablists.query(query);
        };

        $scope.loadMore = function() {
          var query = {limit: 10};
          if ($scope.vocablists) {
            query.startVal = $scope.vocablists[$scope.vocablists.length - 1].created;
          }
          Vocablists.query(query, function(value) {
            $scope.vocablists = $scope.vocablists.concat(value);
          });
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

        $scope.orderBy = function(predicate) {
          if (predicate === $scope.predicate) {
            $scope.reverse = !$scope.reverse;
          } else {
            $scope.reverse = false;
            $scope.predicate = predicate;
          }
        };

        $scope.$watch('param', function() {
          $scope.vocablists = Vocablists.query({query: $scope.param});
        });

        $scope.query = function() {
          Vocablists.query({
            query: $scope.param
          });
        };
      }
]);
