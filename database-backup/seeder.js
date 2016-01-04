/* jshint strict: false */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var vocablists = require('./seed.json');
var VocablistSchema = require('./../app/modelSchemas/vocablist.schema');
var VocabSchema = require('./../app/modelSchemas/vocab.schema');
var Vocab = mongoose.model('Vocab', VocabSchema);
var Vocablist = mongoose.model('Vocablist', VocablistSchema);
var User = mongoose.model('User', require('./../app/modelSchemas/user.schema'));
var db = mongoose.connection;
var migrator = require('./migrator');
var takeruUser = {
  firstName: 'Takeru',
  lastName: 'Komiya',
  email: 'takeru@fake.com',
  username: 'tkomiya',
  password: 'password',
  provider: 'local',
  displayName: 'Takeru Komiya'
};

function dropDatabase() {
  return new Promise(function(resolve, reject) {
    db.db.dropDatabase(function(error) {
      if (error) {
        reject(error);
      } else {
        resolve();
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

function migrate(vocablist) {
  var migratedList = [];
  for (var i = 0; i < vocablist.length; i++) {
    migratedList.push(migrator.migrate(vocablist[i]));
  }
  return migratedList;
}

function createVocablistPromise(vocablist, user) {
  vocablist.user = user;
  return new Promise(function(resolve, reject) {
    Vocab.create(migrate(vocablist.vocab), function(err, vocabsDoc) {
      if (err) {
        reject(err);
      } else if (!vocabsDoc) {
        err('Vocabs was empty...');
      } else {
        var vlistDoc = new Vocablist(vocablist);
        vlistDoc.vocab = vocabsDoc;
        vlistDoc.save(function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  });
}

function createPromises(user) {
  var promises = [];
  for (var i = 0; i < vocablists.length; i++) {
    promises.push(createVocablistPromise(vocablists[i], user));
  }
  return Promise.all(promises);
}

mongoose.connect('mongodb://localhost/vocabtester-dev');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
  dropDatabase().
    then(function() {
      return User.create(takeruUser);
    }).
    then(createPromises).
    then(exit).
    catch(exitError);
});
//for all vocablists, find the vocabs and add their reference
