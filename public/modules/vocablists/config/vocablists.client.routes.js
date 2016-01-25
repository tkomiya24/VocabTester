'use strict';

//Setting up route
angular.module('vocablists').config(['$stateProvider',
  function($stateProvider) {
    function checkAuthentication($q, Authentication) {
      return $q(function(resolve, reject) {
        if (!Authentication.currentUser()) {
          reject('You must be logged in to view this page');
        } else {
          resolve();
        }
      });
    }
    var authenticateResolve = {
      authenticate: checkAuthentication
    };
    // Vocablists state routing
    $stateProvider.
      state('listVocablists', {
        url: '/vocablists',
        templateUrl: 'modules/vocablists/views/list-vocablists.client.view.html',
        resolve: authenticateResolve
      }).
      state('createVocablist', {
        url: '/vocablists/create',
        templateUrl: 'modules/vocablists/views/create-vocablist.client.view.html',
        resolve: authenticateResolve
      }).
      state('editVocablist', {
        url: '/vocablists/:vocablistId/edit',
        templateUrl: 'modules/vocablists/views/edit-vocablist.client.view.html',
        resolve: authenticateResolve
      }).
      state('testVocablist', {
        url: '/vocablists/:vocablistId/test',
        templateUrl: 'modules/vocablists/views/test-vocablist.client.view.html',
        resolve: authenticateResolve
      });
  }
]);
