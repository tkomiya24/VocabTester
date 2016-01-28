'use strict';

var Vocab = require('mongoose').model('Vocab');

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

module.exports.findAndUpdateVocabs = function(vocabs) {
  var promises = [];
  for (var i = 0; i < vocabs.length; i++) {
    promises.push(findAndUpdateVocab(vocabs[i]));
  }
  return Promise.all(promises);
};
