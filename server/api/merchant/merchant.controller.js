'use strict';

var auth = require('../../auth/auth.service');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../../config/environment');
var User = require('../user/user.model');
var Card = require('../card/card.model');
var CardType = require('../cardType/cardType.model');
var Merchant = require('./merchant.model');
var googleService = require('../google/googleService');

/**
 * Creates a new merchant
 * @param	name	the name of the merchant
 * @param	description	description of the merchant
 * @param	email	the email of the merchant
 * @param	address.street	the street of the merchant
 * @param	address.zipCode	zip code of the merchant
 * @param	address.city	city of the merchant
 * @param address.state state or province of the merchant
 * @param	address.country	country of the merchant
 * @param	phone	phone number of the merchant
 * @param	url	the URL of the merchant
 * @param	vatNumber the VAT/tax registration number of the merchant
 */
exports.createMerchant = function (req, res, next) {
  console.log('kalder google service' + req.body.address);
  googleService.getAddress(req.body.address, function(err, googleObject) {
    console.log('callback fra google' + googleObject);
    var newMerchant = new Merchant(req.body);
    newMerchant.status = 1;
    newMerchant.lastUpdated = Date.now();
    newMerchant.createdByUser_id = req.user._id;
    newMerchant.adminUser_id = [req.user._id];
    newMerchant.formattedAddress = googleObject.formattedAddress;
    newMerchant.location = [googleObject.location.lng, googleObject.location.lat];
    console.log(newMerchant);
    newMerchant.save(function(err, savedMerchant) {
      if(err) {
        return handleError(res, err);
      }
      res.json(savedMerchant);
    });
  })
};

/**
 * Gets the info for the merchant I as user is associated with
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
    Merchant.find({
      createdByUser_id: userId  // FIX SO IT LOOKS THRU ARRAY OF ADMIN USERS INSTEAD OF CREATED BY
    }, function(err, merchant) {
      if (err) return next(err);
      if (!merchant) return res.json(401);
      res.json(merchant);
    });
};


exports.myCardTypes = function(req, res, next) {
  CardType.find({
    merchant_id: req.params.merchantId
  }, function(err, cardTypes) {
    if (err) return next(err);
    if (!cardTypes) return res.json(401);
    res.json(cardTypes);
  });
};

exports.createCardType = function(req, res, next) {
  var newCardType = new CardType(req.body);
  console.log(newCardType);
  newCardType.status = 1;
  newCardType.lastUpdated = Date.now();
  newCardType.createdByUser_id = req.user._id;
  newCardType.eventTypes.eventType = 'purchase';
  newCardType.eventTypes.eventPoints = 1;
  newCardType.save(function(err, savedCardType) {
    if(err) {
      return handleError(res, err);
    }
    res.json(savedCardType);
  });
};

function handleError(res, err) {
  return res.send(500, err);
};