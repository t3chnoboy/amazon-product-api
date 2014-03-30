var http = require('http');
var crypto = require('crypto');
var request = require('request');
var Promise = require('es6-promise').Promise;

var generateTimestamp = function() {

  var addZero = function(number) {
    if ((10 > number && number >= 0)) {
      return "0" + number;
    } else {
      return number + "";
    }
  };

  var now = new Date();
  var year = now.getUTCFullYear();
  var month = addZero(now.getUTCMonth() + 1);
  var day = addZero(now.getUTCDate());
  var hours = addZero(now.getUTCHours());
  var mins = addZero(now.getUTCMinutes());
  var secs = addZero(now.getUTCSeconds());
  var timestamp = [year, month, day].join('-') + 'T' + [hours, mins, secs].join(':') + '.000Z';

  return timestamp;
};

var generateSignature = function(stringToSign, awsSecret) {
  var hmac = crypto.createHmac('sha256', awsSecret);
  var signature = hmac.update(stringToSign).digest('base64');

  return signature;
};

var generateQueryString = function(query, credentials) {
  var condition = query.condition || 'All';
  var keywords = query.keywords || '';
  var responseGroup = (query.responseGroup || 'ItemAttributes').replace(/,/g, '%2C');
  var searchIndex = query.searchIndex || 'All';
  var unsignedString =
    "AWSAccessKeyId=" + credentials.awsId +
    "&AssociateTag=" + credentials.awsTag +
    "&Condition=" + condition +
    "&Keywords=" + (escape(keywords)) +
    "&Operation=ItemSearch&ResponseGroup=" + responseGroup +
    "&SearchIndex=" + searchIndex +
    "&Service=AWSECommerceService&Timestamp=" + (escape(generateTimestamp())) +
    "&Version=2011-08-01";
  var signature = escape(generateSignature('GET\nwebservices.amazon.com\n/onca/xml\n' + unsignedString, credentials.awsSecret)).replace(/\+/g, '%2B');
  var queryString = 'http://webservices.amazon.com/onca/xml?' + unsignedString + '&Signature=' + signature;

  return queryString;
};

var itemSearchStream = function(credentials) {
  return function(query) {
    var url = generateQueryString(query, credentials);
    return request(url);
  };
};

var itemSearch = function(credentials) {

  return function(query, cb) {

    var url = generateQueryString(query, credentials);

    if (typeof cb == 'function'){

      request(url, function(error, response, body){

        if (error){
          cb(error);
        }

        if (response.statusCode != 200) {
          cb(body);
        }

        cb(null, body);
      });

    }

    var promise = new Promise(function(resolve, reject) {

      request(url, function(error, response, body) {

        if (error){
          reject(error);
        }

        if (response.statusCode != 200){
          reject(body);
        }

        resolve(body);
      });
    });
    return promise;
  };

};

var createClient = function(credentials) {
  return {
    itemSearch: itemSearch(credentials),
    itemSearchStream: itemSearchStream(credentials)
  };
};

exports.createClient = createClient;
