'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var supportedLanguages = ['English', 'Japanese', 'Korean'];

/**
 * Vocab Schema
 */
var VocabSchema = new Schema({
  primaryLanguage: {
    type: String,
    required: 'Please set primary language',
    enum: supportedLanguages
  },
  translations: [{
    language: {
      type: String,
      trim: true,
      enum: supportedLanguages
    },
    translation: {
      type: String,
      trim: true,
      required: 'Translation is requied'
    }
  }],
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Vocab', VocabSchema);
