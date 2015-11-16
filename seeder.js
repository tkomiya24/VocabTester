/* jshint strict: false */
var mongoose = require('mongoose');
var vocablists = require('./database-backup/seed.json');
var rsvp = require('rsvp');
//launch mongodb
mongoose.connect('mongodb://localhost/vocabtester-dev');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
  db.db.dropDatabase();
});
//add all vocab objects to database
//for all vocablists, find the vocabs and add their reference
