'use strict';

var http = require('http');
var url = require('url');
var querystring = require('querystring');

function formatQuery(query) {
  var formattedQuery = {};
  var queryString = query.street + ', ' + query.zipCode + ' ' + query.city + ', ' + query.country;
  formattedQuery.address = queryString;
  return formattedQuery;
};

function formatResponse(response) {
  var formattedResponse = {};
  response.forEach( function(result) {
    console.log(result.formatted_address);
    if (result.geometry.location_type === 'ROOFTOP' || result.geometry.location_type === 'RANGE_INTERPOLATED') {
      formattedResponse.formattedAddress = result.formatted_address;
      formattedResponse.location = result.geometry.location;
    }
  });
  return formattedResponse;
};

exports.getAddress = function(address, callBack) {
  var addressString = querystring.stringify(formatQuery(address));
  var options = {
    host: 'maps.googleapis.com',
    path: '/maps/api/geocode/json?' + addressString,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': 0
    }
  };
  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    var body = '';
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      if (res.statusCode === 200) {
        var objectifiedBody = JSON.parse(body);
        if (objectifiedBody.status === 'OK') {
          console.log('lykkedes med: ' + objectifiedBody.results);
          return callBack(null, formatResponse(objectifiedBody.results));
        }
        else {
          console.log('status ikke ok' + body);
          return callBack('Google did not return OK', null);
        }
      }
      else {
        console.log('status code ikke 200' + res.statusCode);
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