'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Vocablist Schema
 */
var VocablistSchema = new Schema({
	name: {
		type: String,
		required: 'Please fill Vocablist name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Vocablist', VocablistSchema);