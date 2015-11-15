'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users.server.controller');
  var vocablists = require('../../app/controllers/vocablists.server.controller');

  // Vocablists Routes
  app.route('/vocablists')
  .get(vocablists.list)
  .post(users.requiresLogin, vocablists.create);

	app.route('/vocablists/:vocablistId')
		.get(vocablists.read)
		.put(users.requiresLogin, vocablists.update)
		.delete(users.requiresLogin, vocablists.hasAuthorization, vocablists.delete);

  // Finish by binding the Vocablist middleware
  app.param('vocablistId', vocablists.vocablistByID);
};
