'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var errorHandler = require('./errors.server.controller');
var Vocablist = mongoose.model('Vocablist');
var _ = require('lodash');
var Vocab = mongoose.model('Vocab');
var rsvp = require('rsvp');

function findVocabPromise(vocab) {
  console.log(vocab);
  console.log('Making find vocab promise with vocab: ' + vocab._id);
  return new rsvp.Promise(function(resolve, error) {
    Vocab.findById(vocab._id,
      function(err, doc) {
        if (err) {
          error(err);
        } else if (!doc) {
          error(new Error('Failed to load Vocab ' + vocab._id));
        } else {
          _.extend(doc, vocab);
          resolve(doc);
        }
      }
    );
  });
}

function makeFindVocabPromises(vocabs) {
  console.log('making find vocab promises');
  var promises = [];
  for (var i = 0; i < vocabs.length; i++) {
    promises.push(findVocabPromise(vocabs[i]));
  }
  return rsvp.all(promises);
}

function makeSaveVocabPromise(vocab) {
  return new rsvp.Promise(function(resolve, error) {
    vocab.save(function(err) {
      if (err) {
        error(err);
      } else {
        resolve();
      }
    });
  });
}

function makeSaveVocabPromises(vocabs) {
  console.log('making save vocab pormises');
  var promises = [];
  for (var i = 0; i < vocabs.length; i++) {
    promises.push(makeSaveVocabPromise(vocabs[i]));
  }
  return rsvp.all(promises);
}

function saveVocablistPromise(vocablist) {
  return rsvp.Promise(function(resolve, error) {
    vocablist.save(function(err) {
      if (err) {
        error(err);
      } else {
        resolve();
      }
    });
  });
}
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
  req.vocablist.populate('vocabs', function(err) {
    if (err) {
      return res.status(400).send(new Error('Failed to load Vocablist ' + req.vocablist._id));
    } else {
      res.jsonp(req.vocablist);
    }
  });
};

/**
 * Update a Vocablist
 */
exports.update = function(req, res) {
  console.log('in the update method');
  var vocablist = req.vocablist;
  console.log(req.body);
  vocablist = _.extend(vocablist , req.body);
  makeFindVocabPromises(vocablist.vocabs).then(makeSaveVocabPromises).
    then(function() {
      return saveVocablistPromise(vocablist);
    }).
    then(function() {
      res.jsonp(vocablist);
    }).
    catch(
      function(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    );
};

/**
 * Delete an Vocablist
 */
exports.delete = function(req, res) {
  var vocablist = req.vocablist;

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
  Vocablist.find().sort('-created').populate('vocabs').exec(function(err, vocablists) {
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
  Vocablist.findById(id).exec(function(err, vocablist) {
    if (err) {
      return next(err);
    }
    if (!vocablist) {
      return next(new Error('Failed to load Vocablist ' + id));
    }
    req.vocablist = vocablist;
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
