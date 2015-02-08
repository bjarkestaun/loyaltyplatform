'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.post('/', controller.create);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/me/cards/status/:status', auth.isAuthenticated(), controller.getCards);
router.get('/me/cards/:cardId', auth.isAuthenticated(), controller.getCardDetails);
router.get('/me/merchants/cardtypes/:merchantId', controller.getCardTypes);
router.get('/me/merchants/cards/:merchantId', auth.isAuthenticated(), controller.getMerchantCards);
router.get('/me/merchants', controller.getMerchants);
router.post('/me/merchants/search', controller.searchForMerchants);
router.post('/me/cards', auth.isAuthenticated(), controller.createCard);
router.post('/me/cards/:cardId/event', auth.isAuthenticated(), controller.requestEvent);
router.put('/me/cards/:cardId', auth.isAuthenticated(), controller.approveUsingCard);

module.exports = router;