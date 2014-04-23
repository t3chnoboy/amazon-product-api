var generateQueryString = require('./utils').generateQueryString,
    request = require('request'),
    parseXML = require('xml2js').parseString
    Promise = require('es6-promise').Promise;

var itemSearch = function(credentials) {

  return function(query, cb) {
    var url = generateQueryString(query, credentials);

    if (typeof cb === 'function') {
      request(url, function(err, response, body) {

        if (err) {
          cb(err);
        }

        if (response.statusCode != 200) {
          parseXML(body, function(err, resp){
            if (err){
              cb(err);
            }
            cb(resp.ItemSearchErrorResponse);
          });
        } else {
          parseXML(body, function(err, resp){
            results = resp.ItemSearchResponse.Items[0].Item
            cb(null, results);
          });
        }
      });

    }

    var promise = new Promise(function(resolve, reject) {

      request(url, function(err, response, body) {

        if (err) {
          reject(err);
        }

        if (response.statusCode != 200) {
          parseXML(body, function(err, resp){
            if(err){
              reject(err)
            }
            reject(resp.ItemSearchErrorResponse);
          });
        } else {
          parseXML(body, function(err, resp){
            results = resp.ItemSearchResponse.Items[0].Item;
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
    itemSearch: itemSearch(credentials)
  }
};

exports.createClient = createClient;
