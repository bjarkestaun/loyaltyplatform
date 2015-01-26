	'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PlaceSchema = new Schema({
  email: String,
  name: String,
  earnedPoints: Number,
  maxPoints: Number
});

module.exports = mongoose.model('Place', PlaceSchema)