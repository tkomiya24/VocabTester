'use strict';

//Setting up route
angular.module('vocablists').config(['$stateProvider', 'resolutionServiceProvider',
  function($stateProvider, resolutionProvider) {
    var authenticateResolve = {
      authenticate: resolutionProvider.checkAuthentication
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
      state('showVocablist', {
        url: '/vocablists/show/:vocablistId',
        templateUrl: 'modules/vocablists/views/show-vocablist.client.view.html',
        resolve: authenticateResolve
      }).
      state('editVocablist', {
        url: '/vocablists/edit/:vocablistId',
        templateUrl: 'modules/vocablists/views/edit-vocablist.client.view.html',
        resolve: authenticateResolve
      }).
      state('testVocablist', {
        url: '/vocablists/test/:vocablistId',
        templateUrl: 'modules/vocablists/views/test-vocablist.client.view.html',
        resolve: authenticateResolve
      });
  }
]);
