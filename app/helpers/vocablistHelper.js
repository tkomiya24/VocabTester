'use strict';

var Vocab = require('mongoose').model('Vocab');
var Vocablist = require('mongoose').model('Vocablist');

function createVocabs(user, vocabs) {
  var createVocabPromises = [];
  for (var i = 0; i < vocabs.length; i++) {
    var vocab = new Vocab(vocabs[i]);
    vocab.user = user;
    createVocabPromises.push(vocab.save());
  }
  return Promise.all(createVocabPromises);
}

function createVocablist(vocablist, user) {
  var vocabs = vocablist.vocab;
  return createVocabs(user, vocabs).
    then(function(vocabDocs) {
      vocablist.vocab = vocabDocs;
      vocablist.user = user;
      return Vocablist.create(vocablist);
    });
}

function createVocablists(vocablists, user) {
  var promises = [];
  for (var i = 0; i < vocablists.length; i++) {
    promises.push(createVocablist(vocablists[i], user));
  }
  return new Promise.all(promises);
}

module.exports.createVocablistsWithVocabs = function(vocablists, user) {
  if (vocablists.constructor === Array) {
    return createVocablists(vocablists);
  } else {
    return createVocablist(vocablists, user);
  }
};
