'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
  function($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push(['$q', '$location', '$cookies',
      function($q, $location, $cookies) {
        return {
          responseError: function(rejection) {
            switch (rejection.status) {
              case 401:
                $cookies.remove('user');
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
