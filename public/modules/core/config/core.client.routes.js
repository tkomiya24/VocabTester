'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider', 'Constants',
  function($stateProvider, $urlRouterProvider, Constants) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');

    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html',
      resolve: {
        checkAuthentication: function($q, Authentication, Constants) {
            return $q(function(resolve, reject) {
              Authentication.isAuthenticated(
                function(response) {
                  if (response) {
                    reject(Constants.AUTHORIZED_REROUTE);
                  } else {
                    resolve();
                  }
                },
                function(error) {
                  reject(error);
                }
              );
            });
          }
      }
    });
  }
]);
