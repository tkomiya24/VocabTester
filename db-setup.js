/* globals db */
/* jshint strict: false */
db.vocablists.find({}).forEach(function(vocablist) {
  var idArray = [];
  if (vocablist.vocab && vocablist.vocab.length > 0) {
    vocablist.vocab.forEach(function(vocab) {
      if (vocab.english && vocab.english.lastTested.length === 0) {
        delete vocab.english.lastTested;
      }
      if (vocab.korean && vocab.korean.lastTested.length === 0) {
        delete vocab.korean.lastTested;
      }
      if (vocab.japanese && vocab.japanese.lastTested.length === 0) {
        delete vocab.japanese.lastTested;
      }
    });
    db.vocabs.insert(vocablist.vocab, {ordered: false});
  }
  vocablist.vocab.forEach(function(vocab) {
    idArray.push(db.vocabs.findOne({'english.translation': vocab.english.translation})._id);
  });
  db.vocablists.update({_id: vocablist._id}, {$set: {vocab: idArray}});
});
