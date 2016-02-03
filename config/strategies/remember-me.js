'use strict';

var RememberMe = require('passport-remember-me').Strategy;
var passport = require('passport');
var mongoose = require('mongoose');
var Token = mongoose.model('Token');

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

module.exports = function() {
  passport.use(new RememberMe(
    getUserFromToken,
    require('./../../app/helpers/tokenIssuer').issueTokenToUser
  ));
};
