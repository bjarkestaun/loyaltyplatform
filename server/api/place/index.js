'use strict';

var express = require('express');
var controller = require('./place.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/all', controller.allplaces);
router.get('/me', auth.isAuthenticated(), controller.myplaces);

module.exports = router;