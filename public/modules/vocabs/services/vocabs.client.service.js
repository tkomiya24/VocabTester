'use strict';

//Vocabs service used to communicate Vocabs REST endpoints
angular.module('vocabs').factory('Vocabs', ['$resource',
	function($resource) {
		return $resource('vocabs/:vocabId', { vocabId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);