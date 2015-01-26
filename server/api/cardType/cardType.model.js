	'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CardTypeSchema = new Schema({
  created: {type: Date, default: Date.now()},
  status: Number, // 0: inactive, 1: active
  lastUpdated: Date,
  name: {type: String, required: true},
  description: String,
  createdByUser_id: {type: Schema.Types.ObjectId, ref: 'User'},
  merchant_id: {type: Schema.Types.ObjectId, ref: 'Merchant'},
  maxPoints: Number,
  duration: Number,
  eventTypes: {
    eventType: String,
    eventPoints: Number
  }
});

module.exports = mongoose.model('CardType', CardTypeSchema);