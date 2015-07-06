'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Vocab = mongoose.model('Vocab'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, vocab;

/**
 * Vocab routes tests
 */
describe('Vocab CRUD tests', function() {
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

		// Save a user to the test db and create new Vocab
		user.save(function() {
			vocab = {
				name: 'Vocab Name'
			};

			done();
		});
	});

	it('should be able to save Vocab instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vocab
				agent.post('/vocabs')
					.send(vocab)
					.expect(200)
					.end(function(vocabSaveErr, vocabSaveRes) {
						// Handle Vocab save error
						if (vocabSaveErr) done(vocabSaveErr);

						// Get a list of Vocabs
						agent.get('/vocabs')
							.end(function(vocabsGetErr, vocabsGetRes) {
								// Handle Vocab save error
								if (vocabsGetErr) done(vocabsGetErr);

								// Get Vocabs list
								var vocabs = vocabsGetRes.body;

								// Set assertions
								(vocabs[0].user._id).should.equal(userId);
								(vocabs[0].name).should.match('Vocab Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Vocab instance if not logged in', function(done) {
		agent.post('/vocabs')
			.send(vocab)
			.expect(401)
			.end(function(vocabSaveErr, vocabSaveRes) {
				// Call the assertion callback
				done(vocabSaveErr);
			});
	});

	it('should not be able to save Vocab instance if no name is provided', function(done) {
		// Invalidate name field
		vocab.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vocab
				agent.post('/vocabs')
					.send(vocab)
					.expect(400)
					.end(function(vocabSaveErr, vocabSaveRes) {
						// Set message assertion
						(vocabSaveRes.body.message).should.match('Please fill Vocab name');
						
						// Handle Vocab save error
						done(vocabSaveErr);
					});
			});
	});

	it('should be able to update Vocab instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vocab
				agent.post('/vocabs')
					.send(vocab)
					.expect(200)
					.end(function(vocabSaveErr, vocabSaveRes) {
						// Handle Vocab save error
						if (vocabSaveErr) done(vocabSaveErr);

						// Update Vocab name
						vocab.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Vocab
						agent.put('/vocabs/' + vocabSaveRes.body._id)
							.send(vocab)
							.expect(200)
							.end(function(vocabUpdateErr, vocabUpdateRes) {
								// Handle Vocab update error
								if (vocabUpdateErr) done(vocabUpdateErr);

								// Set assertions
								(vocabUpdateRes.body._id).should.equal(vocabSaveRes.body._id);
								(vocabUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Vocabs if not signed in', function(done) {
		// Create new Vocab model instance
		var vocabObj = new Vocab(vocab);

		// Save the Vocab
		vocabObj.save(function() {
			// Request Vocabs
			request(app).get('/vocabs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Vocab if not signed in', function(done) {
		// Create new Vocab model instance
		var vocabObj = new Vocab(vocab);

		// Save the Vocab
		vocabObj.save(function() {
			request(app).get('/vocabs/' + vocabObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', vocab.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Vocab instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vocab
				agent.post('/vocabs')
					.send(vocab)
					.expect(200)
					.end(function(vocabSaveErr, vocabSaveRes) {
						// Handle Vocab save error
						if (vocabSaveErr) done(vocabSaveErr);

						// Delete existing Vocab
						agent.delete('/vocabs/' + vocabSaveRes.body._id)
							.send(vocab)
							.expect(200)
							.end(function(vocabDeleteErr, vocabDeleteRes) {
								// Handle Vocab error error
								if (vocabDeleteErr) done(vocabDeleteErr);

								// Set assertions
								(vocabDeleteRes.body._id).should.equal(vocabSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Vocab instance if not signed in', function(done) {
		// Set Vocab user 
		vocab.user = user;

		// Create new Vocab model instance
		var vocabObj = new Vocab(vocab);

		// Save the Vocab
		vocabObj.save(function() {
			// Try deleting Vocab
			request(app).delete('/vocabs/' + vocabObj._id)
			.expect(401)
			.end(function(vocabDeleteErr, vocabDeleteRes) {
				// Set message assertion
				(vocabDeleteRes.body.message).should.match('User is not logged in');

				// Handle Vocab error error
				done(vocabDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Vocab.remove().exec();
		done();
	});
});