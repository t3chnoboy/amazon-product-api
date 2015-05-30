var generateQueryString = require('./utils').generateQueryString
    request = require('request'),
    parseXML = require('xml2js').parseString,
    Promise = require('es6-promise').Promise;

var runQuery = function(credentials, method) {

  return function(query, cb) {
    var url = generateQueryString(query, method, credentials),
        results;

    if (typeof cb === 'function') {
      request(url, function(err, response, body) {

        if (err) {
          cb(err);
        } else if (!response) {
            cb("No response (check internet connection)");
        } else if (response.statusCode !== 200) {
          parseXML(body, function(err, resp){
            if (err){
              cb(err);
            }
            cb(resp[method + 'ErrorResponse']);
          });
        } else {
          parseXML(body, function(err, resp){
            results = resp[method + 'Response'].Items[0].Item;
            cb(null, results);
          });
        }
      });

    }

    var promise = new Promise(function(resolve, reject) {

      request(url, function(err, response, body) {

        if (err) {
          reject(err);
        } else if (!response) {
            reject("No response (check internet connection)");
        } else if (response.statusCode !== 200) {
          parseXML(body, function(err, resp){
            if(err){
              reject(err);
            }
            reject(resp[method + 'ErrorResponse']);
          });
        } else {
          parseXML(body, function(err, resp){
            results = resp[method + 'Response'].Items[0].Item;
            resolve(results);
          });
        }
      });
    });

    return promise;
  };
};

var createClient = function(credentials) {
  return {
    itemSearch: runQuery(credentials, 'ItemSearch'),
    itemLookup: runQuery(credentials, 'ItemLookup')
  };
};

exports.createClient = createClient;
