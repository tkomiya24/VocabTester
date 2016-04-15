'use strict';

//Setting up route
angular.module('vocabs').config(['$stateProvider', 'resolutionServiceProvider',
  function($stateProvider, resolutionProvider) {
    var authenticateResolve = {
      authenticate: resolutionProvider.checkAuthentication
    };
    // Vocablists state routing
    $stateProvider.
      state('listVocabs', {
        url: '/vocabs',
        templateUrl: 'modules/vocabs/views/list-vocabs.client.view.html',
        resolve: authenticateResolve
      });
  }
]);
