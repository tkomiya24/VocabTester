'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')();
var config = require('./config/config');
var mongoose = require('mongoose');
var chalk = require('chalk');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
  if (err) {
    console.error(chalk.red('Could not connect to MongoDB!'));
    console.log(chalk.red(err));
  }
});

mongoose.Promise = global.Promise;

mongoose.connection.once('open', function() {
  var app = require('./config/express')(db);
  require('./config/passport')();
  app.listen(config.port);
  exports = module.exports = app;
  console.log('MEAN.JS application started on port ' + config.port);
});
