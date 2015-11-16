'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.export = new Schema({
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