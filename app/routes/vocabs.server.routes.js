'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var vocabs = require('../../app/controllers/vocabs.server.controller');

	// Vocabs Routes
	app.route('/vocabs')
		.get(vocabs.list)
		.post(users.requiresLogin, vocabs.create);

	app.route('/vocabs/:vocabId')
		.get(vocabs.read)
		.put(users.requiresLogin, vocabs.hasAuthorization, vocabs.update)
		.delete(users.requiresLogin, vocabs.hasAuthorization, vocabs.delete);

	// Finish by binding the Vocab middleware
	app.param('vocabId', vocabs.vocabByID);
};
