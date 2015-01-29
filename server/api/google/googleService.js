'use strict';

var http = require('http');
var url = require('url');

function formatQuery(query) {
  var queryString = '';
  queryString += query.street + ', ' + query.zipCode + ' ' + query.city + ', ' + query.country;
  var queryObject = {};
  queryObject.address = queryString;
  return queryObject;
};

function formatResponse(response) {
  return response;
};

exports.getAddress = function(address, callBack) {
  var addressObject = formatQuery(address);
  console.log('start på funktion ' + addressObject.address);
  var options = {
    host: 'maps.googleapis.com',
    path: '/maps/api/geocode/json',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    query: {'address': addressObject.address}
  };
  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    var body = '';
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      console.log('nået til end' + body);
      if (res.statusCode === 200) {
        console.log('res 200 ' + body);
        return callBack(null, body);
      }
      else {
        return callBack('Status code is: ' + res.statusCode, null);
      }
    });
    req.on('error', function(err) {
      return callBack(err, null);
    });
  });
  req.write;
  req.end();
};