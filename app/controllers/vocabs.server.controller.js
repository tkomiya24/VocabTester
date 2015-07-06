'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Vocab = mongoose.model('Vocab'),
	_ = require('lodash');

/**
 * Create a Vocab
 */
exports.create = function(req, res) {
	var vocab = new Vocab(req.body);
	vocab.user = req.user;

	vocab.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vocab);
		}
	});
};

/**
 * Show the current Vocab
 */
exports.read = function(req, res) {
	res.jsonp(req.vocab);
};

/**
 * Update a Vocab
 */
exports.update = function(req, res) {
	var vocab = req.vocab ;

	vocab = _.extend(vocab , req.body);

	vocab.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vocab);
		}
	});
};

/**
 * Delete an Vocab
 */
exports.delete = function(req, res) {
	var vocab = req.vocab ;

	vocab.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vocab);
		}
	});
};

/**
 * List of Vocabs
 */
exports.list = function(req, res) { 
	Vocab.find().sort('-created').populate('user', 'displayName').exec(function(err, vocabs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vocabs);
		}
	});
};

/**
 * Vocab middleware
 */
exports.vocabByID = function(req, res, next, id) { 
	Vocab.findById(id).populate('user', 'displayName').exec(function(err, vocab) {
		if (err) return next(err);
		if (! vocab) return next(new Error('Failed to load Vocab ' + id));
		req.vocab = vocab ;
		next();
	});
};

/**
 * Vocab authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.vocab.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
