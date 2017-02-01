var generateQueryString = require('./utils').generateQueryString;
var request = require('request');
var parseXML = require('xml2js').parseString;
var Promise = require('es6-promise').Promise;

var runQuery = function fnRunQuery(credentials, method) {
  return function queryRun(query, cb) {
    var req = query.request || request;
    var url = generateQueryString(query, method, credentials);

    var p = new Promise(function queryPromise(resolve, reject) {
      var success = function fnSuccess(results) {
        if (typeof cb === 'function') {
          cb(null, results);
        } else {
          resolve(results);
        }
      };

      var failure = function fnFailure(err) {
        if (typeof cb === 'function') {
          cb.call(null, err);
        } else {
          reject(err);
        }
      };

      req(url, function performRequest(err, response, body) {
        if (err) {
          failure(err);
        } else if (!response) {
          failure('No response (check internet connection)');
        } else if (response.statusCode !== 200) {
          parseXML(body, function parseXMLcb(error, resp) {
            if (error) {
              failure(error);
            } else {
              failure(resp[method + 'ErrorResponse']);
            }
          });
        } else {
          parseXML(body, function parseXMLcb(error, resp) {
            var respObj = resp[method + 'Response'];

            if (error) {
              failure(error);
            }
            if (respObj.Items && respObj.Items.length > 0) {
              // Request Error
              if (respObj.Items[0].Request &&
                  respObj.Items[0].Request.length > 0 &&
                  respObj.Items[0].Request[0].Errors) {
                failure(respObj.Items[0].Request[0].Errors);
              } else if (respObj.Items[0].Item) {
                success({ resp, data: respObj });
              }
            } else if (respObj.BrowseNodes && respObj.BrowseNodes.length > 0) {
              // Request Error
              if (respObj.BrowseNodes[0].Request &&
                respObj.BrowseNodes[0].Request.length > 0 &&
                respObj.BrowseNodes[0].Request[0].Errors) {
                failure(respObj.BrowseNodes[0].Request[0].Errors);
              } else if (respObj.BrowseNodes[0].BrowseNode) {
                success({ resp, data: respObj });
              }
            }
          });
        }
      });
    });

    if (typeof cb !== 'function') {
      return p;
    }

    return null;
  };
};

var createClient = function fnCreateClient(credentials) {
  return {
    itemSearch: runQuery(credentials, 'ItemSearch'),
    itemLookup: runQuery(credentials, 'ItemLookup'),
    browseNodeLookup: runQuery(credentials, 'BrowseNodeLookup'),
  };
};

exports.createClient = createClient;
