/* jshint strict: false */
var mongoose = require('mongoose');
var vocablists = require('./database-backup/seed.json');
var rsvp = require('rsvp');
var VocablistSchema = require('./app/modelSchemas/vocablist.schema');
var VocabSchema = require('./app/modelSchemas/vocab.schema');
var Vocab = mongoose.model('Vocab', VocabSchema);
var Vocablist = mongoose.model('Vocablist', VocablistSchema);
var db = mongoose.connection;

function dropDatabase() {
  return new rsvp.Promise(function(res, err) {
    db.db.dropDatabase(function(error) {
      if (error) {
        err(error);
      } else {
        res();
      }
    });
  });
}

function exit() {
  process.exit();
}

function exitError(error) {
  console.log(error);
  process.exit(1);
}

function createVocablistPromise(vocablist) {
  return new rsvp.Promise(function(resolve, error) {
    Vocab.create(vocablist.vocab, function(err, vocabsDoc) {
      if (err) {
        error(err);
      } else if (!vocabsDoc) {
        err('Vocabs was empty...');
      } else {
        var vlistDoc = new Vocablist(vocablist);
        vlistDoc.vocab = vocabsDoc;
        vlistDoc.save(function(err) {
          if (err) {
            error(err);
          } else {
            resolve();
          }
        });
      }
    });
  });
}

function createPromises() {
  var promises = [];
  for (var i = 0; i < vocablists.length; i++) {
    promises.push(createVocablistPromise(vocablists[i]));
  }
  return rsvp.all(promises);
}

mongoose.connect('mongodb://localhost/vocabtester-dev');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
  dropDatabase().then(createPromises).then(exit).catch(exitError);
});
//for all vocablists, find the vocabs and add their reference