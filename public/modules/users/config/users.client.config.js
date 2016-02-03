'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
  function($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push(['$q', '$location',
      function($q, $location) {
        return {
          responseError: function(rejection) {
            switch (rejection.status) {
              case 401:
                $location.path('signin');
                break;
              case 403:
                break;
            }

            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);
