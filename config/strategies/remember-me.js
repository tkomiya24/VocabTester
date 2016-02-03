'use strict';

var RememberMe = require('passport-remember-me').Strategy;
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Token = mongoose.model('Token');
var tokenGenerator = require('rand-token');

function getUserFromToken(token, done) {
  Token.find({token: token}, {user: 1}, null).populate('user', function(err, token) {
    if (err) {
      return done(err);
    } else if (!token) {
      return done(null, false);
    } else {
      return done(null, token.user);
    }
  });
}

function issueTokenToUser(user, done) {
  var token = tokenGenerator.generate(64);
  Token.create({token: token, user: user}, function(err, token) {
    if (err) {
      return done(err);
    } else {
      return done(null, token);
    }
  });
}

module.exports = function() {
  passport.use(new RememberMe(
    getUserFromToken,
    issueTokenToUser
  ));
};
