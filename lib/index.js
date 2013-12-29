var Promise, createClient, crypto, generateQueryString, generateSignature, generateTimestamp, get, http, itemSearch, parseString;

http = require('http');
crypto = require('crypto');
Promise = require('es6-promise').Promise;
parseString = require('xml2js').parseString;

generateTimestamp = function() {
  var addZero, day, hours, mins, month, now, secs, timestamp, year;
  addZero = function(number) {
    if ((10 > number && number >= 0)) {
      return "0" + number;
    } else {
      return number + "";
    }
  };
  now = new Date();
  year = now.getUTCFullYear();
  month = addZero(now.getUTCMonth() + 1);
  day = addZero(now.getUTCDate());
  hours = addZero(now.getUTCHours());
  mins = addZero(now.getUTCMinutes());
  secs = addZero(now.getUTCSeconds());
  return timestamp = [year, month, day].join('-') + 'T' + [hours, mins, secs].join(':') + '.000Z';
};

generateSignature = function(stringToSign, awsSecret) {
  var hmac;
  hmac = crypto.createHmac('sha256', awsSecret);
  return hmac.update(stringToSign).digest('base64');
};

generateQueryString = function(query, client) {
  var condition, keywords, queryString, responseGroup, searchIndex, signature, unsignedString;
  condition = query.condition || 'All';
  keywords = query.keywords || '';
  responseGroup = query.responseGroup || 'ItemAttributes';
  responseGroup = responseGroup.replace(/,/g, '%2C');
  searchIndex = query.searchIndex || 'All';
  unsignedString = "AWSAccessKeyId=" + client.awsId + "&AssociateTag=" + client.awsTag + "&Condition=" + condition + "&Keywords=" + (escape(keywords)) + "&Operation=ItemSearch&ResponseGroup=" + responseGroup + "&SearchIndex=" + searchIndex + "&Service=AWSECommerceService&Timestamp=" + (escape(generateTimestamp())) + "&Version=2011-08-01";
  signature = generateSignature('GET\nwebservices.amazon.com\n/onca/xml\n' + unsignedString, client.awsSecret);
  signature = escape(signature);
  signature = signature.replace(/\+/g, '%2B');
  return queryString = 'http://webservices.amazon.com/onca/xml?' + unsignedString + '&Signature=' + signature;
};

get = function(url) {
  return new Promise(function(resolve, reject) {
    var request;
    request = http.get(url, function(response) {
      var responseData;
      responseData = '';
      response.on('data', function(chunk) {
        responseData += chunk;
      });
      if (response.statusCode === 200) {
        response.on('end', function() {
          parseString(responseData, function(error, result) {
            if (error != null) {
              reject(error);
            } else {
              resolve(result.ItemSearchResponse.Items[0].Item);
            }
          });
        });
      } else {
        response.on('end', function() {
          parseString(responseData, function(error, result) {
            if (error != null) {
              reject(error);
            } else {
              reject(result);
            }
          });
        });
      }
    });
    request.on('error', function(error) {
      reject(error);
    });
  });
};

itemSearch = function(client) {
  if (client == null) {
    client = {};
  }
  client.awsId = client.awsId || '';
  client.awsSecret = client.awsSecret || '';
  client.awsTag = client.awsTag || '';
  return function(query) {
    if (query == null) {
      query = {};
    }
    return get(generateQueryString(query, client));
  };
};

createClient = function(client) {
  return {
    itemSearch: itemSearch(client)
  };
};

exports.createClient = createClient;
