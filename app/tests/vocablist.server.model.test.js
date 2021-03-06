'use strict';

/**
 * Module dependencies.
 */
var should = require('should');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Vocablist = mongoose.model('Vocablist');

/**
 * Globals
 */
var user;
var vocablist;

/**
 * Unit tests
 */
describe('Vocablist Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      vocablist = new Vocablist({
        name: 'Vocablist Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      return vocablist.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      vocablist.name = '';

      return vocablist.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Vocablist.remove().exec();
    User.remove().exec();

    done();
  });
});
