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
          return failure(err);
        }

        if (!response) {
          return failure('No response (check internet connection)');
        }

        if (response.statusCode !== 200) {
          return parseXML(body, function parseXMLcb(error, resp) {
            if (error) {
              return failure(error);
            }
            return failure(resp[method + 'ErrorResponse']);
          });
        }

        return parseXML(body, function parseXMLcb(error, resp) {
          var respObj = resp[method + 'Response'];
          var Errors = [];
          var Items = [];
          var BrowseNodes = [];

          if (error) {
            return failure(error);
          }

          if (!respObj) {
            return failure('No response object');
          }

          if (respObj.Items && respObj.Items.length) {
            if (respObj.Items[0] && respObj.Items[0].Request
              && respObj.Items[0].Request.length && respObj.Items[0].Request[0].Errors) {
              Errors = Errors.concat(respObj.Items[0].Request[0].Errors);
            }

            if (respObj.Items[1] && respObj.Items[1].Request &&
              respObj.Items[1].Request.length && respObj.Items[1].Request[0].Errors) {
              Errors = Errors.concat(respObj.Items[1].Request[0].Errors);
            }

            // Request Error
            if (Errors.length) {
              return failure(Errors);
            }

            if (respObj.Items[0] && respObj.Items[0].Item) {
              Items = Items.concat(respObj.Items[0].Item);
            }

            if (respObj.Items[1] && respObj.Items[1].Item) {
              Items = Items.concat(respObj.Items[1].Item);
            }

            return success({
              response: respObj.Items,
              results: Items
            });
          } else if (respObj.BrowseNodes && respObj.BrowseNodes.length) {
            if (respObj.BrowseNodes[0] && respObj.BrowseNodes[0].Request &&
            respObj.BrowseNodes[0].Request.length && respObj.BrowseNodes[0].Request[0].Errors) {
              Errors = Errors.concat(respObj.BrowseNodes[0].Request[0].Errors);
            }

            if (respObj.BrowseNodes[1] && respObj.BrowseNodes[1].Request &&
            respObj.BrowseNodes[1].Request.length && respObj.BrowseNodes[1].Request[0].Errors) {
              Errors = Errors.concat(respObj.BrowseNodes[1].Request[0].Errors);
            }

            // Request Error
            if (Errors.length) {
              return failure(Errors);
            }

            if (respObj.BrowseNodes[0] && respObj.BrowseNodes[0].Item) {
              BrowseNodes = BrowseNodes.concat(respObj.BrowseNodes[0].Item);
            }

            if (respObj.BrowseNodes[1] && respObj.BrowseNodes[1].Item) {
              BrowseNodes = BrowseNodes.concat(respObj.BrowseNodes[1].Item);
            }

            return success({
              response: respObj.BrowseNodes,
              results: BrowseNodes
            });
          }

          return failure('No Items or BrowseNodes in response object');
        });
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
    browseNodeLookup: runQuery(credentials, 'BrowseNodeLookup')
  };
};

exports.createClient = createClient;
