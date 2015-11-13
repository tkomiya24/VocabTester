'use strict';

(function() {
  // Vocabs Controller Spec
  describe('Vocabs Controller Tests', function() {
    // Initialize global variables
    var VocabsController,
    scope,
    $httpBackend,
    $stateParams,
    $location;

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
    beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;

      // Initialize the Vocabs controller.
      VocabsController = $controller('VocabsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one Vocab object fetched from XHR', inject(function(Vocabs) {
      // Create sample Vocab using the Vocabs service
      var sampleVocab = new Vocabs({
        name: 'New Vocab'
      });

      // Create a sample Vocabs array that includes the new Vocab
      var sampleVocabs = [sampleVocab];

      // Set GET response
      $httpBackend.expectGET('vocabs').respond(sampleVocabs);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.vocabs).toEqualData(sampleVocabs);
    }));

    it('$scope.findOne() should create an array with one Vocab object fetched from XHR using a vocabId URL parameter', inject(function(Vocabs) {
      // Define a sample Vocab object
      var sampleVocab = new Vocabs({
        name: 'New Vocab'
      });

      // Set the URL parameter
      $stateParams.vocabId = '525a8422f6d0f87f0e407a33';

      // Set GET response
      $httpBackend.expectGET(/vocabs\/([0-9a-fA-F]{24})$/).respond(sampleVocab);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.vocab).toEqualData(sampleVocab);
    }));

    it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Vocabs) {
      // Create a sample Vocab object
      var sampleVocabPostData = new Vocabs({
        name: 'New Vocab'
      });

      // Create a sample Vocab response
      var sampleVocabResponse = new Vocabs({
        _id: '525cf20451979dea2c000001',
        name: 'New Vocab'
      });

      // Fixture mock form input values
      scope.name = 'New Vocab';

      // Set POST response
      $httpBackend.expectPOST('vocabs', sampleVocabPostData).respond(sampleVocabResponse);

      // Run controller functionality
      scope.create();
      $httpBackend.flush();

      // Test form inputs are reset
      expect(scope.name).toEqual('');

      // Test URL redirection after the Vocab was created
      expect($location.path()).toBe('/vocabs/' + sampleVocabResponse._id);
    }));

    it('$scope.update() should update a valid Vocab', inject(function(Vocabs) {
      // Define a sample Vocab put data
      var sampleVocabPutData = new Vocabs({
        _id: '525cf20451979dea2c000001',
        name: 'New Vocab'
      });

      // Mock Vocab in scope
      scope.vocab = sampleVocabPutData;

      // Set PUT response
      $httpBackend.expectPUT(/vocabs\/([0-9a-fA-F]{24})$/).respond();

      // Run controller functionality
      scope.update();
      $httpBackend.flush();

      // Test URL location to new object
      expect($location.path()).toBe('/vocabs/' + sampleVocabPutData._id);
    }));

    it('$scope.remove() should send a DELETE request with a valid vocabId and remove the Vocab from the scope', inject(function(Vocabs) {
      // Create new Vocab object
      var sampleVocab = new Vocabs({
        _id: '525a8422f6d0f87f0e407a33'
      });

      // Create new Vocabs array and include the Vocab
      scope.vocabs = [sampleVocab];

      // Set expected DELETE response
      $httpBackend.expectDELETE(/vocabs\/([0-9a-fA-F]{24})$/).respond(204);

      // Run controller functionality
      scope.remove(sampleVocab);
      $httpBackend.flush();

      // Test array after successful delete
      expect(scope.vocabs.length).toBe(0);
    }));
  });
}());
