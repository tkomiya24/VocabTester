'use strict';

var should = require('should');
var request = require('supertest');
var app = require('../../server');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Vocablist = mongoose.model('Vocablist');
var agent = request.agent(app);

/**
 * Globals
 */
var credentials;
var user;
var vocablist;

/**
 * Vocablist routes tests
 */
describe('Vocablist CRUD tests', function() {
  beforeEach(function(done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'password'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Vocablist
    user.save(function() {
      vocablist = {
        name: 'Vocablist Name'
      };

      done();
    });
  });

  it('should be able to save Vocablist instance if logged in', function(done) {
    agent.post('/auth/signin')
    .send(credentials)
    .expect(200)
    .end(function(signinErr, signinRes) {
      // Handle signin error
      if (signinErr) done(signinErr);

      // Get the userId
      var userId = user.id;

      // Save a new Vocablist
      agent.post('/vocablists')
      .send(vocablist)
      .expect(200)
      .end(function(vocablistSaveErr, vocablistSaveRes) {
        // Handle Vocablist save error
        if (vocablistSaveErr) done(vocablistSaveErr);

        // Get a list of Vocablists
        agent.get('/vocablists').
          end(function(vocablistsGetErr, vocablistsGetRes) {
            // Handle Vocablist save error
            if (vocablistsGetErr) done(vocablistsGetErr);

            // Get Vocablists list
            var vocablists = vocablistsGetRes.body;

            // Set assertions
            (vocablists[0].user._id).should.equal(userId);
            (vocablists[0].name).should.match('Vocablist Name');

            // Call the assertion callback
            done();
        });
      });
    });
  });

  it('should not be able to save Vocablist instance if not logged in', function(done) {
    agent.post('/vocablists')
    .send(vocablist)
    .expect(401)
    .end(function(vocablistSaveErr, vocablistSaveRes) {
        // Call the assertion callback
        done(vocablistSaveErr);
    });
  });

  it('should not be able to save Vocablist instance if no name is provided', function(done) {
    // Invalidate name field
    vocablist.name = '';

    agent.post('/auth/signin')
    .send(credentials)
    .expect(200)
    .end(function(signinErr, signinRes) {
      // Handle signin error
      if (signinErr) done(signinErr);

      // Get the userId
      var userId = user.id;

      // Save a new Vocablist
      agent.post('/vocablists')
      .send(vocablist)
      .expect(400)
      .end(function(vocablistSaveErr, vocablistSaveRes) {
        // Set message assertion
        (vocablistSaveRes.body.message).should.match('Please fill Vocablist name');

        // Handle Vocablist save error
        done(vocablistSaveErr);
      });
    });
  });

  it('should be able to update Vocablist instance if signed in', function(done) {
    agent.post('/auth/signin')
    .send(credentials)
    .expect(200)
    .end(function(signinErr, signinRes) {
      // Handle signin error
      if (signinErr) done(signinErr);

      // Get the userId
      var userId = user.id;

      // Save a new Vocablist
      agent.post('/vocablists')
      .send(vocablist)
      .expect(200)
      .end(function(vocablistSaveErr, vocablistSaveRes) {
        // Handle Vocablist save error
        if (vocablistSaveErr) done(vocablistSaveErr);

        // Update Vocablist name
        vocablist.name = 'WHY YOU GOTTA BE SO MEAN?';

        // Update existing Vocablist
        agent.put('/vocablists/' + vocablistSaveRes.body._id)
        .send(vocablist)
        .expect(200)
        .end(function(vocablistUpdateErr, vocablistUpdateRes) {
          // Handle Vocablist update error
          if (vocablistUpdateErr) done(vocablistUpdateErr);

          // Set assertions
          (vocablistUpdateRes.body._id).should.equal(vocablistSaveRes.body._id);
          (vocablistUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

          // Call the assertion callback
          done();
        });
      });
    });
  });

  it('should be able to get a list of Vocablists if not signed in', function(done) {
    // Create new Vocablist model instance
    var vocablistObj = new Vocablist(vocablist);
    // Save the Vocablist
    vocablistObj.save(function() {
      // Request Vocablists
      request(app).get('/vocablists')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.an.Array.with.lengthOf(1);

        // Call the assertion callback
        done();
      });
    });
  });

  it('should be able to get a single Vocablist if not signed in', function(done) {
    // Create new Vocablist model instance
    var vocablistObj = new Vocablist(vocablist);

    // Save the Vocablist
    vocablistObj.save(function() {
      request(app).get('/vocablists/' + vocablistObj._id)
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.an.Object.with.property('name', vocablist.name);

        // Call the assertion callback
        done();
      });
    });
  });

  it('should be able to delete Vocablist instance if signed in', function(done) {
    agent.post('/auth/signin')
    .send(credentials)
    .expect(200)
    .end(function(signinErr, signinRes) {
          // Handle signin error
          if (signinErr) done(signinErr);

          // Get the userId
          var userId = user.id;

          // Save a new Vocablist
          agent.post('/vocablists')
          .send(vocablist)
          .expect(200)
          .end(function(vocablistSaveErr, vocablistSaveRes) {
          // Handle Vocablist save error
          if (vocablistSaveErr) done(vocablistSaveErr);

          // Delete existing Vocablist
          agent.delete('/vocablists/' + vocablistSaveRes.body._id)
          .send(vocablist)
          .expect(200)
          .end(function(vocablistDeleteErr, vocablistDeleteRes) {
            // Handle Vocablist error error
            if (vocablistDeleteErr) done(vocablistDeleteErr);
            // Set assertions
            (vocablistDeleteRes.body._id).should.equal(vocablistSaveRes.body._id);
            // Call the assertion callback
            done();
        });
      });
    });
  });

  it('should not be able to delete Vocablist instance if not signed in', function(done) {
    // Set Vocablist user
    vocablist.user = user;
    // Create new Vocablist model instance
    var vocablistObj = new Vocablist(vocablist);
    // Save the Vocablist
    vocablistObj.save(function() {
      // Try deleting Vocablist
      request(app).delete('/vocablists/' + vocablistObj._id)
      .expect(401)
      .end(function(vocablistDeleteErr, vocablistDeleteRes) {
        // Set message assertion
        (vocablistDeleteRes.body.message).should.match('User is not logged in');
        // Handle Vocablist error error
        done(vocablistDeleteErr);
      });
    });
  });

  afterEach(function(done) {
    User.remove().exec();
    Vocablist.remove().exec();
    done();
  });
});
