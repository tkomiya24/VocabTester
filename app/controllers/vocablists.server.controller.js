'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Vocablist = mongoose.model('Vocablist'),
	_ = require('lodash');

/**
 * Create a Vocablist
 */
exports.create = function(req, res) {
	var vocablist = new Vocablist(req.body);
	vocablist.user = req.user;

	vocablist.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vocablist);
		}
	});
};

/**
 * Show the current Vocablist
 */
exports.read = function(req, res) {
	res.jsonp(req.vocablist);
};

/**
 * Update a Vocablist
 */
exports.update = function(req, res) {
	var vocablist = req.vocablist ;

	vocablist = _.extend(vocablist , req.body);

	vocablist.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vocablist);
		}
	});
};

/**
 * Delete an Vocablist
 */
exports.delete = function(req, res) {
	var vocablist = req.vocablist ;

	vocablist.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vocablist);
		}
	});
};

/**
 * List of Vocablists
 */
exports.list = function(req, res) { 
	Vocablist.find().sort('-created').populate('user', 'displayName').exec(function(err, vocablists) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vocablists);
		}
	});
};

/**
 * Vocablist middleware
 */
exports.vocablistByID = function(req, res, next, id) { 
	Vocablist.findById(id).populate('user', 'displayName').exec(function(err, vocablist) {
		if (err) return next(err);
		if (! vocablist) return next(new Error('Failed to load Vocablist ' + id));
		req.vocablist = vocablist ;
		next();
	});
};

/**
 * Vocablist authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.vocablist.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
