'use strict';

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

angular.module(ApplicationConfiguration.applicationModuleName).constant('Constants', {
  AUTHORIZED_REROUTE: 'AUTHORIZED_REROUTE',
  UNAUTHORIZED_REROUTE: 'UNAUTHORIZED_REROUTE'
});

angular.module(ApplicationConfiguration.applicationModuleName).run(['$rootScope', '$state',
  function($rootScope, $state) {
    $rootScope.$on('$stateChangeError',
      function(event, toState, toParams, fromState, fromParams, error) {
        $rootScope.error = error;
        return $state.go('signin');
      });
  }]);
