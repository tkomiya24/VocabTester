'use strict';

(function() {
  // Vocablists Controller Spec
  describe('Vocablists Controller Tests', function() {
    // Initialize global variables
    var VocablistsController;
    var scope;
    var $httpBackend;
    var $stateParams;
    var $location;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function() {
      jasmine.addMatchers({
        toEqualData: function(util, customEqualityTesters) {
          return {
            compare: function(actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function($controller, $rootScope,
                               _$location_, _$stateParams_, _$httpBackend_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;

      // Initialize the Vocablists controller.
      VocablistsController = $controller('VocablistsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one Vocablist object fetched from XHR',
       inject(function(Vocablists) {
      // Create sample Vocablist using the Vocablists service
      var sampleVocablist = new Vocablists({
        name: 'New Vocablist'
      });

      // Create a sample Vocablists array that includes the new Vocablist
      var sampleVocablists = [sampleVocablist];

      // Set GET response
      $httpBackend.expectGET('vocablists').respond(sampleVocablists);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.vocablists).toEqualData(sampleVocablists);
    }));

    it('$scope.findOne() should create an array with one Vocablist object fetched' +
       'from XHR using a vocablistId URL parameter', inject(function(Vocablists) {
      // Define a sample Vocablist object
      var sampleVocablist = new Vocablists({
        name: 'New Vocablist'
      });

      // Set the URL parameter
      $stateParams.vocablistId = '525a8422f6d0f87f0e407a33';

      // Set GET response
      $httpBackend.expectGET(/vocablists\/([0-9a-fA-F]{24})$/).respond(sampleVocablist);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.vocablist).toEqualData(sampleVocablist);
    }));

    it('$scope.create() with valid form data should send a POST request with the' +
       'form input values and then locate to new object URL', inject(function(Vocablists) {
      // Create a sample Vocablist object
      var sampleVocablistPostData = new Vocablists({
        name: 'New Vocablist'
      });

      // Create a sample Vocablist response
      var sampleVocablistResponse = new Vocablists({
        _id: '525cf20451979dea2c000001',
        name: 'New Vocablist'
      });

      // Fixture mock form input values
      scope.name = 'New Vocablist';

      // Set POST response
      $httpBackend.
        expectPOST('vocablists', sampleVocablistPostData).
        respond(sampleVocablistResponse);

      // Run controller functionality
      scope.create();
      $httpBackend.flush();

      // Test form inputs are reset
      expect(scope.name).toEqual('');

      // Test URL redirection after the Vocablist was created
      expect($location.path()).toBe('/vocablists/' + sampleVocablistResponse._id);
    }));

    it('$scope.update() should update a valid Vocablist', inject(function(Vocablists) {
      // Define a sample Vocablist put data
      var sampleVocablistPutData = new Vocablists({
        _id: '525cf20451979dea2c000001',
        name: 'New Vocablist'
      });

      // Mock Vocablist in scope
      scope.vocablist = sampleVocablistPutData;

      // Set PUT response
      $httpBackend.expectPUT(/vocablists\/([0-9a-fA-F]{24})$/).respond();

      // Run controller functionality
      scope.update();
      $httpBackend.flush();

      // Test URL location to new object
      expect($location.path()).toBe('/vocablists/' + sampleVocablistPutData._id);
    }));

    it('$scope.remove() should send a DELETE request with a valid' +
       'vocablistId and remove the Vocablist from the scope', inject(function(Vocablists) {
      // Create new Vocablist object
      var sampleVocablist = new Vocablists({
        _id: '525a8422f6d0f87f0e407a33'
      });

      // Create new Vocablists array and include the Vocablist
      scope.vocablists = [sampleVocablist];

      // Set expected DELETE response
      $httpBackend.expectDELETE(/vocablists\/([0-9a-fA-F]{24})$/).respond(204);

      // Run controller functionality
      scope.remove(sampleVocablist);
      $httpBackend.flush();

      // Test array after successful delete
      expect(scope.vocablists.length).toBe(0);
    }));
  });
}());
