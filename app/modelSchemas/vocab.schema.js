'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var supportedLanguages = ['English', 'Japanese', 'Korean'];
var translationSchema = {
  translation: {
    type: String,
    trim: true,
    required: 'Translation is requied'
  },
  timesTested: {
    type: Number
  },
  timesCorrect: {
    type: Number
  },
  lastTested: {
    type: Date
  }
};
module.exports = new Schema({
  primaryLanguage: {
    type: String,
    required: 'Please set primary language',
    enum: supportedLanguages
  },
  english: translationSchema,
  korean: translationSchema,
  japanese: translationSchema,
  created: {
    type: Date,
    default: Date.now
  }
});
