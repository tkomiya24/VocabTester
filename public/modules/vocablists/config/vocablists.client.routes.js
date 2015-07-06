'use strict';

//Setting up route
angular.module('vocablists').config(['$stateProvider',
	function($stateProvider) {
		// Vocablists state routing
		$stateProvider.
		state('listVocablists', {
			url: '/vocablists',
			templateUrl: 'modules/vocablists/views/list-vocablists.client.view.html'
		}).
		state('createVocablist', {
			url: '/vocablists/create',
			templateUrl: 'modules/vocablists/views/create-vocablist.client.view.html'
		}).
		state('viewVocablist', {
			url: '/vocablists/:vocablistId',
			templateUrl: 'modules/vocablists/views/view-vocablist.client.view.html'
		}).
		state('editVocablist', {
			url: '/vocablists/:vocablistId/edit',
			templateUrl: 'modules/vocablists/views/edit-vocablist.client.view.html'
		});
	}
]);