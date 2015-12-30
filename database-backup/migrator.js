'use strict';

module.exports.migrate = function(vocab) {

  var refactoredVocab = {};
  refactoredVocab.word = vocab.english.translation;
  var alternateLanguage = vocab.japanese ? 'japanese' : 'korean';

  refactoredVocab.translation = vocab[alternateLanguage].translation;
  refactoredVocab.timesTested = vocab[alternateLanguage].timesTested;
  refactoredVocab.timesCorrect = vocab[alternateLanguage].timesCorrect;
  refactoredVocab.lastTested = vocab[alternateLanguage].lastTested | '';
  return refactoredVocab;
};
