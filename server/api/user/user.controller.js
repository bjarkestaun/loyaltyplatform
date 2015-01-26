'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var Card = require('../card/card.model');
var Merchant = require('../merchant/merchant.model');

var validationError = function(res, err) {
  return res.json(422, err);
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
exports.showCards = function(req, res, next) {
  var matchCriteria = {user_id: req.user_id};
  if (req.params.status) {
    matchCriteria.status = req.body.status;
  }
  Card.find(matchCriteria, function(err, cards) {
    res.json(cards);
  });
};

/**
 * Gets a list of the merchants relevant for the authenticated user
 * @return array of merchants including details
 */
exports.showMerchants = function(req, res, next) {
  Merchant.find({}, function(err, merchants) {
    if (err) return next(err);
    if (!merchants) return res.json(401);
    res.json(merchants);
  });
};

/**
 * Adds a new card for a merchant for the authenticated user
 * @param merchantid the ID of the merchant
 */
exports.createCard = function(req, res, next) {
  // check if user exists and merchant exists and cardtype exists
  // then if they do create new card
  CardType.findById(req.body.cardtype_id, function(err, thisCardType) {
    if(err || !thisCardType) {
      if (!thisCardType) { err = 'Sorry - the cardtype does not exists'; }
      return handleError(res, err);
    }
    var newCard = new Card(req.body);
    newCard.status = 1;
    newCard.lastUpdated = Date.now();
    newCard.merchant_id = thisCardType.merchant_id;
    // newCard.user_id = req.user_id;
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
exports.requestPoints = function(req, res, next) {
  // TODO
  return res.json(null);
};

/** Approves using a card for the authenticated user
 * @param cardid the ID of the card
 */
exports.approveUsingCard = function(req, res, next) {
  // TODO
  return res.json(null);
};

function handleError(res, err) {
  return res.send(500, err);
};