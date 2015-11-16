var mongoose = require('mongoose');
var vocablists = require('./database-backup/seed.json');
//launch mongodb
mongoose.connect('mongodb://localhost/vocabtester-dev');
//clean database
//add all vocab objects to database
//for all vocablists, find the vocabs and add their reference
