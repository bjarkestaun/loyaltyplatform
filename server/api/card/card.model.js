	'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CardSchema = new Schema({
  created: {type: Date, default: Date.now()},
  status: Number, // 0: inactive, 1: active
  lastUpdated: Date,
  user_id: {type: Schema.Types.ObjectId, ref: 'User'},
  merchant_id: {type: Schema.Types.ObjectId, ref: 'Merchant'},
  cardType_id: {type: Schema.Types.ObjectId, ref: 'CardType'},
  validFrom: {type: Date, default: Date.now()},
  events: [{
  	earned: {type: Date, default: Date.now()},
  	points: Number
  }]
});

module.exports = mongoose.model('Card', CardSchema);