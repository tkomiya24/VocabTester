/* jshint strict: false */
var mongoose = require('mongoose');
var vocablists = require('./database-backup/seed.json');
var rsvp = require('rsvp');
var VocablistSchema = require('./app/modelSchemas/vocablist.schema');
var VocabSchema = require('./app/modelSchemas/vocab.schema');
//launch mongodb
mongoose.connect('mongodb://localhost/vocabtester-dev');
mongoose.model('Vocab', VocabSchema);
mongoose.model('Vocablist', VocablistSchema);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
  db.db.dropDatabase();
});
//add all vocab objects to database
//for all vocablists, find the vocabs and add their reference
