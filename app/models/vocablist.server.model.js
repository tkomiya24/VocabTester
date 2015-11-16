'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var VocablistSchema = require('../modelSchemas/vocablist.schema');

mongoose.model('Vocablist', VocablistSchema);
