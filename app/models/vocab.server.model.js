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
	translations: [{
		language: {
			type: String,
			trime: true,
			enum: ['English', 'Japanese', 'Korean']
		}
		translation: {
			type: String,
			trim: true,
			required: "Translation is requied"
		}
	}],
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Vocab', VocabSchema);