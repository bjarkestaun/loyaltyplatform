'use strict';

var express = require('express');
var controller = require('./merchant.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

/*
router.post('/', auth.isAuthenticated(), controller.createMerchant);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/me/cardtypes', auth.isAuthenticated(), controller.myCards);
router.post('/me/cardtypes', auth.isAuthenticated(), controller.createCardType);
*/

module.exports = router;