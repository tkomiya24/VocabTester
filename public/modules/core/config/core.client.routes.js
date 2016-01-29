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
        checkAuthentication: function(Authentication, $q) {
          return $q(function(resolve, reject) {
            if (!Authentication.currentUser()) {
              resolve();
            } else {
              reject(Constants.AUTHORIZED_REROUTE);
            }
          });
        }
      }
    });
  }
]);
