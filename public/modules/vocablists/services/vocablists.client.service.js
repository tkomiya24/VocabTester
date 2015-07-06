'use strict';

//Vocablists service used to communicate Vocablists REST endpoints
angular.module('vocablists').factory('Vocablists', ['$resource',
	function($resource) {
		return $resource('vocablists/:vocablistId', { vocablistId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);