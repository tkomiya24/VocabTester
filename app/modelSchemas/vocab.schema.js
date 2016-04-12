'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
  word: {
    type: String,
    required: 'Please enter the word'
  },
  translation: {
    type: String,
    required: 'Please enter the translation of this word'
  },
  timesTested: {
    type: Number,
    default: 0
  },
  timesCorrect: {
    type: Number,
    default: 0
  },
  lastTested: {
    type: Date
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});
