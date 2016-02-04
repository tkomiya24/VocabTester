'use strict';

angular.module(ApplicationConfiguration.constantsModuleName, []).constant('Constants', {
  AUTHORIZED_REROUTE: 'AUTHORIZED_REROUTE',
  UNAUTHORIZED_REROUTE: 'UNAUTHORIZED_REROUTE'
});

angular.module(ApplicationConfiguration.resolutionModuleName, []).provider('resolutionService',
  function resolutionProvider() {
    this.checkAuthentication = function($q, Authentication, Constants) {
        return $q(function(resolve, reject) {
          Authentication.isAuthenticated(
            function(response) {
              if (response) {
                resolve(response);
              } else {
                reject(Constants.UNAUTHORIZED_REROUTE);
              }
            },
            function(error) {
              reject(error);
            }
          );
        });
      };
    this.$get = function() {};
  });

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName,
               ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
  function($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_') {
    window.location.hash = '#!';
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

angular.module(ApplicationConfiguration.applicationModuleName).
  run(['$rootScope', '$state', 'Constants',
  function($rootScope, $state, Constants) {
    $rootScope.$on('$stateChangeError',
      function(event, toState, toParams, fromState, fromParams, error) {
        if (error === Constants.UNAUTHORIZED_REROUTE) {
          $rootScope.authenticationError = 'You must be signed in to view this page';
          return $state.go('signin');
        } else if (error === Constants.AUTHORIZED_REROUTE) {
          return $state.go('listVocablists');
        }
      });
    $rootScope.$on('$stateChangeSuccess', function() {
      $rootScope.authenticationError = null;
    });
  }]).directive('setClassWhenAtTop', function($window) {
      var $win = angular.element($window); // wrap window object as jQuery object
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var topClass = attrs.setClassWhenAtTop; // get CSS class from directive's attribute value
          var offsetTop =  attrs.offsetStart;
          console.log(offsetTop);
          $win.on('scroll', function(e) {
            if ($win.scrollTop() >= offsetTop) {
              element.addClass(topClass);
            } else {
              element.removeClass(topClass);
            }
          });
        }
      };
    });
