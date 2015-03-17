var generateItemSearchQueryString = require('./utils').generateQueryString.itemSearch,
    generateItemLookupQueryString = require('./utils').generateQueryString.itemLookup,
    request = require('request'),
    parseXML = require('xml2js').parseString,
    Promise = require('es6-promise').Promise;

var itemSearch = function(credentials) {

  return function(query, cb) {
    var url = generateItemSearchQueryString(query, credentials),
        results;

    if (typeof cb === 'function') {
      request(url, function(err, response, body) {

        if (err) {
          cb(err);
        }

        if (response.statusCode !== 200) {
          parseXML(body, function(err, resp){
            if (err){
              cb(err);
            }
            cb(resp.ItemSearchErrorResponse);
          });
        } else {
          parseXML(body, function(err, resp){
            results = resp.ItemSearchResponse.Items[0].Item;
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

        if (response.statusCode !== 200) {
          parseXML(body, function(err, resp){
            if(err){
              reject(err);
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

var itemLookup = function(credentials) {

  return function(query, cb) {
    var url = generateItemLookupQueryString(query, credentials),
        results;

    if (typeof cb === 'function') {
      request(url, function(err, response, body) {

        if (err) {
          cb(err);
        }

        if (response.statusCode !== 200) {
          parseXML(body, function(err, resp){
            if (err){
              cb(err);
            }
            cb(resp.ItemLookupErrorResponse);
          });
        } else {
          parseXML(body, function(err, resp) {
            results = resp.ItemLookupResponse.Items[0].Item;
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

        if (response.statusCode !== 200) {
          parseXML(body, function(err, resp) {
            if(err){
              reject(err);
            }
            reject(resp.ItemLookupErrorResponse);
          });
        } else {
          parseXML(body, function(err, resp) {
            results = resp.ItemLookupResponse.Items[0].Item;
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
    itemSearch: itemSearch(credentials),
    itemLookup: itemLookup(credentials)
  };
};

exports.createClient = createClient;
