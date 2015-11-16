'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var supportedLanguages = ['English', 'Japanese', 'Korean'];
module.exports = new Schema({
  name: {
    type: String,
    required: 'Please fill Vocablist name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  vocabs: [{
    type: Schema.Types.ObjectId,
    ref: 'Vocab'
  }]
});
