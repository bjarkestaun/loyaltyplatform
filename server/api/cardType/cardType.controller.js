'use strict';

var auth = require('../../auth/auth.service');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../../config/environment');
var User = require('../user/user.model');
var Card = require('../card/card.model');
var Merchant = require('./merchant.model');


function handleError(res, err) {
  return res.send(500, err);
};