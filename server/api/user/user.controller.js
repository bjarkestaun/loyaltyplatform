'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var Card = require('../card/card.model');
var Merchant = require('../merchant/merchant.model');
var CardType = require('../cardType/cardType.model');
var async = require('async');
var mongoose = require('mongoose');

var validationError = function(res, err) {
  return res.json(422, err);
};

function handleError(res, err) {
  return res.send(500, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 * @param email     the email of the user
 * @param password  the password of the user
 * @return token
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

exports.getMerchants = function(req, res, next) {
  Merchant.find({}, function(err, merchants) {
    if (err) return next(err);
    if (!merchants) return res.json(401);
    res.json(merchants);
  });
};

exports.searchForMerchants = function(req, res, next) {
  var userLocation = [req.body.lng, req.body.lat];
  Merchant.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: userLocation
        },
        $maxDistance: req.body.distance
      }
    }
  }, function(err, merchants) {
    if (err) return next(err);
    if (!merchants) return res.json(401);
    res.json(merchants);
  })
};

exports.getCards = function(req, res, next) {
  var matchCriteria = {user_id: req.user._id};
  if (req.params.status) {
    matchCriteria.status = req.params.status;
  }
  var populateQuery = [
    { path: 'merchant_id', select: 'status name description email formattedAddress Location phone url' },
    { path: 'cardType_id', select: 'status name description maxPoints duration eventTypes' }
  ];
  var aggregateQuery = [
    { $match: { user_id: req.user._id, merchant_id: req.params.merchantId } },
    { $unwind: "$events" },
    { $group: { _id: "$_id", cardType_id: { $last: "$cardType_id" }, validFrom: { $last: "$validFrom" }, earnedPoints: {$sum: "$events.points" } } }
  ];
  Card.aggregate(aggregateQuery), function(err, cards) {
    if (err) return next(err);
    if (!cards) return res.json(401);
    Card.populate(cards, populateQuery).exec( function(err, cardsWithInfo) {
      if (err) return next(err);
      if (!cardsWithInfo) return res.json(401);
      res.json(cardsWithInfo);
    });
  };

/*  Card.find(matchCriteria).populate(populateQuery).exec( function(err, cards) {
    if (err) return next(err);
    if (!cards) return res.json(401);
    res.json(cards);
  }); */
};

exports.getCardDetails = function(req, res, next) {
  var populateQuery = [
    {
      path: 'merchant_id',
      select: 'status name description email formattedAddress Location phone url'
    }, {
      path: 'cardType_id',
      select: 'status name description maxPoints duration eventTypes'
    }];
  Card.find({ _id: req.params.cardId }).populate(populateQuery).exec( function(err, cardDetails) {
    if (err) return next(err);
    if (!cardDetails) return res.json(401);
    if (req.user._id != cardDetails.user_id) {
      err = 'Sorry, not your card';
      return next(err);
    }
    res.json(cardDetails)
  });
};

exports.getCardTypes = function(req, res, next) {
  CardType.find({ merchant_id: req.params.merchantId }, function(err, cardTypes) {
    if (err) return next(err);
    if (!cardTypes) return res.json(401);
    res.json(cardTypes);
  });
};

exports.getMerchantCards = function(req, res, next) {
  var merchant_id = mongoose.Types.ObjectId(req.params.merchantId);
  Card.aggregate([
    { $match: { merchant_id: merchant_id, user_id: req.user._id } },
    { $unwind: "$events" },
    { $group: { _id: "$_id", cardType_id: { $last: "$cardType_id" }, validFrom: { $last: "$validFrom" }, earnedPoints: { $sum: "$events.points" } } }
    ], function(err, merchantCards) {
      if (err) return next(err);
      if (!merchantCards) return res.json(401);
      res.json(merchantCards);
    });
};

exports.getCardTypesWithCards = function(req, res, next) {
  var merchant_id = mongoose.Types.ObjectId(req.params.merchantId);
  CardType.find({ merchant_id: merchant_id }).lean().exec( function(err, cardTypes) {
    if (err) return next(err);
    if (!cardTypes) return res.json(401);
    Card.aggregate([
      { $match: { merchant_id: merchant_id, user_id: req.user._id } },
      { $unwind: "$events" },
      { $group: {_id: "$_id", cardType_id: {$last: "$cardType_id" }, validFrom: { $last: "$validFrom" }, earnedPoints: { $sum: "$events.points" } } }
      ], function(err, cards) {
        if (err) return next(err);
        if (!cards) return res.json(401);
        for (var cardType in cardTypes) {
          for (var card in cards) {
            console.log(cards[card].cardType_id);
            console.log(cardTypes[cardType]._id);
            if (cards[card].cardType_id.equals(cardTypes[cardType]._id)) {
              console.log('id match');
              cardTypes[cardType].earnedPoints = cards[card].earnedPoints;
              cardTypes[cardType].validFrom = cards[card].validFrom;
            }
          }
        }
        res.json(cardTypes);
      });
  });
};

exports.createCard = function(req, res, next) {
  // check if user exists and merchant exists and cardtype exists
  // then if they do create new card
  // TODO: refactor so getMerchantCards $unwind method works without initializing a card with a 0 point event
  CardType.findById(req.body.cardType_id, function(err, thisCardType) {
    if(err || !thisCardType) {
      if (!thisCardType) { err = 'Sorry - the cardtype does not exists'; }
      return handleError(res, err);
    }
    var newCard = new Card(req.body);
    newCard.status = 1;
    newCard.lastUpdated = Date.now();
    newCard.merchant_id = thisCardType.merchant_id;
     newCard.user_id = req.user._id;
    newCard.events.push({points: 0});
    newCard.save(function(err, savedCard) {
      if(err) {
        return handleError(res, err);
      }
      res.json(savedCard);
    });
  });
};

exports.requestEvent = function(req, res, next) {
  Card.findById(req.params.cardId, function(err, thisCard) {
    if(err || !thisCard) {
      if (!thisCard) { err = 'Sorry this card does not exist';}
      return handleError(res, err);
    }
/*    if (thisCard.user_id != req.user._id) {
      console.log(thisCard.user_id);
      console.log(req.user._id);
      console.log('not your card');
      console.log(thisCard.user_id == req.user._id);
      err = 'This is not your card';
      return handleError(res, err);
    } */
    thisCard.events.push({points: 1});
    thisCard.save(function(err, savedCard) {
      if(err) {
        return handleError(res,err);
      }
      res.json(savedCard);
    });
  });
};

exports.approveUsingCard = function(req, res, next) {
  res.json(null);
};