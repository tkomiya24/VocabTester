'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
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
  vocab: [{
    type: Schema.Types.ObjectId,
    ref: 'Vocab'
  }],
  chapter: {
    type: Number
  },
  category: {
    type: String,
    trim: true,
    enum: ['Nouns', 'Verbs', 'Adjectives', null]
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});
