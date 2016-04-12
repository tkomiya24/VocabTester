/* jshint strict: false */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var VocablistSchema = require('./../app/modelSchemas/vocablist.schema');
var VocabSchema = require('./../app/modelSchemas/vocab.schema');
var Vocab = mongoose.model('Vocab', VocabSchema);
var Vocablist = mongoose.model('Vocablist', VocablistSchema);
var db = mongoose.connection;

function getAllVocablists() {
  return Vocablist.find({}).exec();
}

function removeCategoryFromName(category, name) {
  if (name.length > category.length) {
    return name.replace(category, '');
  }
  return name;
}

function setChapter(vocablist) {
  if (vocablist.name.toLowerCase().indexOf('chapter') === 0) {
    var chapterlessName = vocablist.name.replace('Chapter', '').trim().split(' ');
    console.log(chapterlessName);
    vocablist.chapter = parseInt(chapterlessName[0]);
    var name = vocablist.name.replace('Chapter' + chapterlessName[0], '');
    vocablist.name = name ? name : vocablist.name;
  }
  if (vocablist.name.indexOf('Nouns') !== -1) {
    vocablist.name = removeCategoryFromName('Nouns', vocablist.name);
    vocablist.category = 'Nouns';
  } else if (vocablist.name.indexOf('Verbs') !== -1) {
    vocablist.name = removeCategoryFromName('Verbs', vocablist.name);
    vocablist.category = 'Verbs';
  } else if (vocablist.name.indexOf('Adjectives') !== -1) {
    vocablist.name = removeCategoryFromName('Adjectives', vocablist.name);
    vocablist.category = 'Verbs';
  }
  return vocablist.save();
}

function setChapters(vocablists) {
  var promises = [];
  vocablists.forEach(function(vocablist) {
    var promise = setChapter(vocablist);
    if (promise) {
      promises.push(promise);
    }
  });
  return Promise.all(promises);
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
  getAllVocablists()
    .then(setChapters)
    .then(exit)
    .catch(exitError);
});
//for all vocablists, find the vocabs and add their reference
