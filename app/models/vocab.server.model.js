'use strict';

var mongoose = require('mongoose');
var VocabSchema = require('../modelSchemas/vocab.schema');
mongoose.model('Vocab', VocabSchema);
