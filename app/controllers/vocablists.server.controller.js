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
var vocablistHelper = require('../helpers/vocablistHelper');
var fs = require('fs');

function saveVocablistPromise(vocablist) {
  if (vocablist.id) {
    return new Promise(function(resolve, error) {
      vocablist.save(function(err) {
        if (err) {
          error(err);
        } else {
          resolve(vocablist);
        }
      });
    });
  } else {
    return new Promise(function(resolve) {
      resolve(vocablist);
    });
  }
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
  vocablistHelper.createVocablistsWithVocabs(req.body, req.user).
    then(function(vocablists) {
      res.jsonp(vocablists);
      return;
    }).
    catch(function(err) {
      errorHandler.sendDatabaseErrorResponse(res, err);
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
        errorHandler.sendDatabaseErrorResponse(res, err);
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
    errorHandler.sendDatabaseErrorResponse(res, err);
  });
};

function getAllVocablists(user, params) {
  var query = user ? {user: user._id} : {};
  var t = Vocablist.find(query).sort('-created');
  if (params) {
    if (params.query) {
      // var r = {$regex: new RegExp(query, 'i')};
      var r = new RegExp(params.query, 'i');
      var conds = [
        {name: r},
        {category: r}
      ];
      if (!isNaN(params.query)) {
        conds.push({chapter: query});
      }
      t.and([{$or: conds}]);
    }
    if (params.limit) {
      t.limit(params.limit);
    }
    if (params.startVal) {
      t.lt('created', params.startVal);
    }
  }
  return t.populate('vocab').exec();
}

/**
 * List of Vocablists
 */
exports.list = function(req, res) {
  getAllVocablists(req.user, req.query)
    .then(function(vocablists) {
      res.jsonp(vocablists);
    })
    .catch(function(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

function stripVocab(vocab) {
  return {
    word: vocab.word,
    translation: vocab.translation,
    timesTested: vocab.timesTested,
    timesCorrect: vocab.timesCorrect,
    lastTested: vocab.lastTested
  };
}

function stripVocablist(vocablist) {
  for (var i = 0; i < vocablist.vocab.length; i++) {
    vocablist.vocab[i] = stripVocab(vocablist.vocab[i]);
  }
  return {
    vocab: vocablist.vocab,
    name: vocablist.name,
    category: vocablist.category,
    created: vocablist.created,
    chapter: vocablist.chapter
  };
}

exports.download = function(req, res, next) {
  populateVocablist(req.vocablist).then(function(vocablist) {
    var stripped = stripVocablist(vocablist);
    res.set('Content-Type', 'application/force-download');
    res.set('Content-Disposition', 'attachment; filename=\"' + vocablist.name + '.json' + '\"');
    res.send(stripped);
  });
};

exports.downloadAll = function(req, res, next) {
  getAllVocablists(req.user)
    .then(function(vocablists) {
      for (var i = 0; i < vocablists.length; i++) {
        vocablists[i] = stripVocablist(vocablists[i]);
      }
      res.set('Content-Type', 'application/force-download');
      res.set('Content-Disposition', 'attachment; filename=\"allVocablists.json\"');
      res.send(vocablists);
    })
    .catch(function(err) {
      errorHandler.sendDatabaseErrorResponse(res, err);
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

exports.mostMistaken = function(req, res, next) {
  Vocab.find({user: req.user._id}).
    where('timesTested').gt(0).
    limit(20).
    then(function(vocabs) {
      vocabs.sort(function(vocab1, vocab2) {
        return (vocab1.timesCorrect / vocab1.timesTested) -
        (vocab2.timesCorrect / vocab2.timesTested);
      });
      res.jsonp({vocab: vocabs});
    }).
    catch(function(err) {
      errorHandler.sendDatabaseErrorResponse(res, err);
    });
};

exports.leastTested = function(req, res, next) {
  Vocab.find({user: req.user._id}).
    sort('timesTested').
    limit(20).
    then(function(vocabs) {
      res.jsonp({vocab: vocabs});
    }).
    catch(function(err) {
      errorHandler.sendDatabaseErrorResponse(res, err);
    });
};

exports.upload = function(req, res, next) {
  fs.readFile(req.files.file.path, function(err, data) {
    try {
      vocablistHelper.createVocablistsWithVocabs(JSON.parse(data), req.user).
        then(function(vocablists) {
          res.status(200).send('Success');
        }).
        catch(function(error) {
          errorHandler.sendDatabaseErrorResponse(res, err);
        });
    } catch (error) {
      res.status(400).send('The file uploaded was not a proper JSON');
    }
  });
};
