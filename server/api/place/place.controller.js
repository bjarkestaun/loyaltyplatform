'use strict';

var mongoose = require('mongoose'),
    Place = require('./place.model');

exports.allplaces = function(req, res) {
	return Place.find(function (err, places) {
		if (!err) {
			return res.json(places);
		} else {
			return res.send(err);
		}
	});
};

exports.myplaces = function(req, res) {
	return Place.find({ 'email': req.user.email }, function (err, places) {
		if (!err) {
			return res.json(places);
		} else {
			return res.send(err);
		}
	});
};