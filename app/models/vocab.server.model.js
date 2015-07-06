'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Vocab Schema
 */
var VocabSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Vocab name',
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

mongoose.model('Vocab', VocabSchema);