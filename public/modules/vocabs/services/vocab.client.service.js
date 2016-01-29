'use strict';

//Vocablists service used to communicate Vocablists REST endpoints
angular.module('vocabs').factory('Vocab', ['$resource',
  function($resource) {
    return $resource(
      'vocabs/:vocabId',
      {
        vocabId: '@_id'
      },
      {
        updateMultiple: {
          method: 'PUT',
          url: 'vocabs/updateMultiple',
          isArray: true
        }
      }
    );
  }
]);
