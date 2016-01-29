'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('vocablists');

angular.module('vocablists').constant('Category', {
  NOUNS: 'Nouns', VERBS: 'Verbs', ADJECTIVES: 'Adjectives'
});
