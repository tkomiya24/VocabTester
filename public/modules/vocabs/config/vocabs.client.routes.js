'use strict';

//Setting up route
angular.module('vocabs').config(['$stateProvider',
	function($stateProvider) {
  // Vocabs state routing
  $stateProvider.
		state('listVocabs', {
  url: '/vocabs',
  templateUrl: 'modules/vocabs/views/list-vocabs.client.view.html'
		}).
		state('createVocab', {
  url: '/vocabs/create',
  templateUrl: 'modules/vocabs/views/create-vocab.client.view.html'
		}).
		state('viewVocab', {
  url: '/vocabs/:vocabId',
  templateUrl: 'modules/vocabs/views/view-vocab.client.view.html'
		}).
		state('editVocab', {
  url: '/vocabs/:vocabId/edit',
  templateUrl: 'modules/vocabs/views/edit-vocab.client.view.html'
		});
	}
]);
