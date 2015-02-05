'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.get('/me/cards/status/:status', auth.isAuthenticated(), controller.showCards);
router.get('/me/merchants/cardtypes/:merchantId', controller.showCardTypes);
router.get('/me/merchants/cards/:merchantId', auth.isAuthenticated(), controller.showMerchantCards);
router.get('/me/merchants', controller.showMerchants);
router.post('/me/merchants/search', controller.searchForMerchants);
// router.post('/me/cards/', auth.isAuthenticated(), controller.createCard);
router.post('/me/cards', auth.isAuthenticated(), controller.createCard);
router.post('/me/cards/:cardId/event', auth.isAuthenticated(), controller.requestEvent);
router.put('/me/cards/:cardId', auth.isAuthenticated(), controller.approveUsingCard);

module.exports = router;