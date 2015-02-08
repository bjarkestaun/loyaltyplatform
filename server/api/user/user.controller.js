'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var Card = require('../card/card.model');
var Merchant = require('../merchant/merchant.model');
var CardType = require('../cardType/cardType.model');
var async = require('async');

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

/**
 * Gets a list of the active Card resource representations, each representing an active Card for the authenticated user
 * @return array of active Card objects including transactions
 */
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

function getCardTypes(req, callback) {
  var queryCardType = CardType.find({ merchant_id: req.params.merchantId }).lean();
  queryCardType.exec( function(err, cardTypes) {
    if (err) {
      console.log(err);
      callback('error: ' + err);
    }
    else {
      console.log('fra getCardTypes ' + cardTypes);
      callback(null, cardTypes);
    }
  });
};

function getMerchantCards(req, callback) {
  Card.aggregate([
    { $match: { user_id: req.user._id, merchant_id: req.params.merchantId } },
    { $unwind: "$events" },
    { $group: { _id: "$_id", cardType_id: { $last: "$cardType_id" }, validFrom: { $last: "$validFrom" }, earnedPoints: {$sum: "$events.points" } } }
    ], function(err, merchantCards) {
      if (err) {
        console.log(err);
        callback('error: ' + err);
      }
      else {
//        var output = results.earnedPoints;
        console.log('fra getpointsoncard ' + JSON.stringify(merchantCards));
        callback(null, merchantCards);
      }
    });
};

function getCardsAndCardTypes(req, callback) {
  async.parallel({
    cards: getCards(req, callback),
    cardTypes: getCardTypes(req, callback)
  }, function(err, cardsAndCardTypes) {
    callback(err, cardsAndCardTypes);
  });
};

exports.getCardTypes = function(req, res, next) {
  CardType.find({
    merchant_id: req.params.merchantId
  }, function(err, cardTypes) {
    if (err) return next(err);
    if (!cardTypes) return res.json(401);
    res.json(cardTypes);
  });
};



/* var addCardsToCardTypes = function(cardTypes, cards, callback) {
  for (var cardTypeKey in cardTypes) {
    for (var cardKey in cards) {
      if (cardTypes[cardTypeKey]._id.equals(cards[cardKey].cardType_id)) {
        getCardDetails(cards[cardKey].cardType_id, function(err, cardTypes)
      }
    } 
  }
  callback(cardTypes);
}; */

exports.getMerchantCards = function(req, res, next) {
  console.log(req);
  // TODO: refactor
  // do more efficient adding of card as object in cardtype instead of two for loops
//  getCardsAndCardTypes(req, function(err, results) {
//    if (err) return next(err);
//    if (!results.cardTypes) return res.json(401);
//    if (!results.cards || results.cards.length === 0) return res.json(results.cardTypes);
    getCardsAndCardTypes(req, function(err, cardsAndCardTypes) {
      console.log('card details ' + JSON.stringify(cardsAndCardTypes));
      res.json(cardsAndCardTypes);
    });
//  });
};

/**
 * Gets a list of the merchants relevant for the authenticated user
 * @return array of merchants including details
 */
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
//      $within: { $centerSphere: [ userLocation , req.body.distance / 6378.137 ] }
    }
  }, function(err, merchants) {
    if (err) return next(err);
    if (!merchants) return res.json(401);
    res.json(merchants);
  })
};

/**
 * Adds a new card for a merchant for the authenticated user
 * @param merchantid the ID of the merchant
 */
exports.createCard = function(req, res, next) {
  // check if user exists and merchant exists and cardtype exists
  // then if they do create new card
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
    newCard.events = [];
    newCard.save(function(err, savedCard) {
      if(err) {
        return handleError(res, err);
      }
      res.json(savedCard);
    });
  });
};

/**
 * Requests points on a card that the authenticated user
 * @param cardid the ID of the card
 */
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

/** Approves using a card for the authenticated user
 * @param cardid the ID of the card
 */
exports.approveUsingCard = function(req, res, next) {
  // TODO
  return res.json(null);
};