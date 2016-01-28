'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var errorHandler = require('./errors.server.controller');
var Vocablist = mongoose.model('Vocablist');
var _ = require('lodash');
var Vocab = mongoose.model('Vocab');
var updateVocabHelper = require('../helpers/updateVocab');

function findAndUpdateVocab(vocab) {
  if (vocab.deleted) {
    return new Promise(function(resolve, reject) {
      Vocab.findByIdAndRemove(
        vocab._id,
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  } else if (vocab._id) {
    return new Promise(function(resolve, reject) {
      Vocab.findByIdAndUpdate(
        vocab._id,
        vocab,
        function(err, doc) {
          if (err) {
            reject(err);
          } else if (!doc) {
            reject(new Error('Failed to update vocab ' + vocab.word));
          } else {
            resolve(doc);
          }
        }
      );
    });
  } else {
    return Vocab.create(vocab);
  }
}

function findAndUpdateVocabs(vocabs) {
  var promises = [];
  for (var i = 0; i < vocabs.length; i++) {
    promises.push(findAndUpdateVocab(vocabs[i]));
  }
  return Promise.all(promises);
}

function saveVocablistPromise(vocablist) {
  return new Promise(function(resolve, error) {
    vocablist.save(function(err) {
      if (err) {
        error(err);
      } else {
        resolve(vocablist);
      }
    });
  });
}

function populateVocablist(vocablist) {
  return new Promise(function(resolve, error) {
    vocablist.populate('vocab', function(err) {
      if (err) {
        error(err);
      } else {
        resolve(vocablist);
      }
    });
  });
}

function removeNullFromArray(array) {
  for (var i = 0; i < array.length; i++) {
    if (!array[i]) {
      array.splice(i, 1);
    }
  }
}

/**
 * Create a Vocablist
 */
exports.create = function(req, res) {
  var vocabs = req.body.vocab;
  Vocab.create(vocabs).
    then(function(vocabDocs) {
      var vocablist = req.body;
      vocablist.vocab = vocabDocs;
      vocablist.user = req.user;
      return Vocablist.create(vocablist);
    }).
    then(function(vocablist) {
      res.jsonp(vocablist);
      return;
    }).
    catch(function(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * Show the current Vocablist
 */
exports.read = function(req, res) {
  req.vocablist.populate('vocab', function(err) {
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
  var vocablist = req.vocablist;
  vocablist = _.extend(vocablist , req.body);
  updateVocabHelper.findAndUpdateVocabs(req.body.vocab).
    then(function(vocabs) {
      removeNullFromArray(vocabs);
      vocablist.vocab = vocabs;
      return saveVocablistPromise(vocablist);
    }).
    then(populateVocablist).
    then(function(vocablist) {
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

function deleteVocabs(vocablist) {
  var ids = [];
  for (var i = 0; i < vocablist.vocab.length; i++) {
    ids.push(vocablist.vocab[i]);
  }
  return Vocab.remove({_id: {$in: ids}});
}

/**
 * Delete an Vocablist
 */
exports.delete = function(req, res) {
  var vocablist = req.vocablist;
  deleteVocabs(vocablist).then(function() {
    return vocablist.remove();
  }).then(function() {
    res.jsonp(vocablist);
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Vocablists
 */
exports.list = function(req, res) {
  var query = req.query.userId ? {user: req.query.userId} : {};
  Vocablist.find(query).sort('-created').populate('vocab').exec(function(err, vocablists) {
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
  if (req.vocablist.user.toString() !== req.user._id.toString()) {
    return res.status(403).send('User is not authorized');
  }
  next();
};
