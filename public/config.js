'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
  // Init module configuration options
  var applicationModuleName = 'vocabtester';
  var constantsModule = 'constants';
  var resolutionModuleName = 'resolution';
  var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',
                                             'ngAnimate', 'ngTouch',
                                             'ngSanitize',  'ui.router',
                                             'ui.bootstrap', 'ui.utils',
                                             constantsModule, resolutionModuleName,
                                             'ngFileUpload'];

  // Add a new vertical module
  var registerModule = function(moduleName, dependencies) {
    // Create angular module
    dependencies = dependencies || [];
    dependencies.push(constantsModule);
    dependencies.push(resolutionModuleName);
    angular.module(moduleName, dependencies);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    constantsModuleName: constantsModule,
    applicationModuleName: applicationModuleName,
    resolutionModuleName: resolutionModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();
