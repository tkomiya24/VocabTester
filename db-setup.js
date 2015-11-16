/* globals db */
/* jshint strict: false */
db.vocablists.find({}).forEach(function(vocablist) {
  var idArray = [];
  if (vocablist.vocab && vocablist.vocab.length > 0) {
    db.vocabs.insert(vocablist.vocab, {ordered: false});
  }
  vocablist.vocab.forEach(function(vocab) {
    idArray.push(db.vocabs.findOne({english: vocab.english})._id);
  });
  db.vocablists.update({_id: vocablist._id}, {$set: {vocab: idArray}});
});
