'use strict';

var mongoose = require('mongoose');
var Token = mongoose.model('Token');
var tokenGenerator = require('rand-token');

module.exports.issueTokenToUser = function(user, done) {
  var token = tokenGenerator.generate(64);
  Token.create({token: token, user: user}, function(err, token) {
    if (err) {
      return done(err);
    } else {
      return done(null, token);
    }
  });
};
