'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Token', tokenSchema);
