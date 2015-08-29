var generateQueryString = require('./utils').generateQueryString,
  request = require('request'),
  parseXML = require('xml2js').parseString,
  Promise = require('es6-promise').Promise;

var runQuery = function (credentials, method) {

  return function (query, cb) {
    var url = generateQueryString(query, method, credentials),
      results;

    if (typeof cb === 'function') {
      request(url, function (err, response, body) {

        if (err) {
          cb(err);
        } else if (!response) {
          cb("No response (check internet connection)");
        } else if (response.statusCode !== 200) {
          parseXML(body, function (err, resp) {
            if (err) {
              cb(err);
            }
            cb(resp[method + 'ErrorResponse']);
          });
        } else {
          parseXML(body, function (err, resp) {
            if (method === 'BrowseNodeLookup' && resp[method + 'Response'].BrowseNodes && resp[method + 'Response'].BrowseNodes.length > 0) {
              results = resp[method + 'Response'].BrowseNodes[0].BrowseNode;
            } else {
              results = resp[method + 'Response'].Items[0].Item;
            }
            cb(null, results);
          });
        }
      });

    }

    var promise = new Promise(function (resolve, reject) {

      request(url, function (err, response, body) {

        if (err) {
          reject(err);
        } else if (!response) {
          reject("No response (check internet connection)");
        } else if (response.statusCode !== 200) {
          parseXML(body, function (err, resp) {
            if (err) {
              reject(err);
            }
            reject(resp[method + 'ErrorResponse']);
          });
        } else {
          parseXML(body, function (err, resp) {
            var results = null;
            var responseObject = resp[method + 'Response'];
            if (responseObject.Items && responseObject.Items.length > 0) {
              results = responseObject.Items[0].Item;
            } else if (responseObject.BrowseNodes && responseObject.BrowseNodes.length > 0) {
              results = responseObject.BrowseNodes[0].BrowseNode;
            }
            resolve(results);
          });
        }
      });
    });

    return promise;
  };
};

var createClient = function (credentials) {
  return {
    itemSearch: runQuery(credentials, 'ItemSearch'),
    itemLookup: runQuery(credentials, 'ItemLookup'),
    browseNodeLookup: runQuery(credentials, 'BrowseNodeLookup')
  };
};

exports.createClient = createClient;