/* jshint strict: false */
var mongoose = require('mongoose');
var vocablists = require('./database-backup/seed.json');
var rsvp = require('rsvp');
var VocablistSchema = require('./app/modelSchemas/vocablist.schema');
var VocabSchema = require('./app/modelSchemas/vocab.schema');
var Vocab = mongoose.model('Vocab', VocabSchema);
var Vocablist = mongoose.model('Vocablist', VocablistSchema);
var db = mongoose.connection;

function getAllVocabs() {
  var vocabs = [];
  for (var i = 0; i < vocablists.length; i++) {
    vocabs.push.apply(vocabs, vocablists[i].vocab);
  }
  return vocabs;
}

function saveVocabs() {
  var vocabs = getAllVocabs();
  return new rsvp.Promise(function(res, err) {
    Vocab.create(vocabs, function(error, result) {
      if (error) {
        err(error);
      } else if (!result) {
        err('Result was empty...');
      } else {
        res(result);
      }
    });
  });
}

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
mongoose.connect('mongodb://localhost/vocabtester-dev');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
  dropDatabase().then(saveVocabs).then(exit).catch(exitError);
});
//add all vocab objects to database
//for all vocablists, find the vocabs and add their reference
