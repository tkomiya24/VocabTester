'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
  // Init module configuration options
  var applicationModuleName = 'vocabtester';
  var constantsModule = 'constants';
  var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',
                                             'ngAnimate', 'ngTouch',
                                             'ngSanitize',  'ui.router',
                                             'ui.bootstrap', 'ui.utils',
                                             constantsModule];

  // Add a new vertical module
  var registerModule = function(moduleName, dependencies) {
    // Create angular module
    dependencies = dependencies || [];
    dependencies.push(constantsModule);
    angular.module(moduleName, dependencies);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    constantsModuleName: constantsModule,
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();
