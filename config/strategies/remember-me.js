'use strict';

var RememberMe = require('passport-remember-me').Strategy;
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Token = mongoose.model('Token');

module.exports = function() {
  passport.use(new RememberMe(
    function(token, done) {

    },
    function(token, done) {

    }
  ));
};
