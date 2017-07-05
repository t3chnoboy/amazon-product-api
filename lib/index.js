/*
eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["query"] }]
*/
var generateQueryString = require('./utils').generateQueryString;
var request = require('request');
var parseXML = require('xml2js').parseString;

if (typeof Promise === 'undefined') {
  Promise = require('es6-promise').Promise; //eslint-disable-line
}

function runQuery(credentials, method) {
  return function queryImpl(query, cb) {
    var req = query.request || request;
    var url = '';
    var p;

    delete query.request;
    url = generateQueryString(query, method, credentials);

    p = new Promise(function executor(resolve, reject) { //eslint-disable-line
      function success(results) {
        if (typeof cb === 'function') {
          cb.apply(null, [null].concat(Array.prototype.slice.call(arguments)));
        } else {
          resolve(results);
        }
      }

      function failure(err) {
        if (typeof cb === 'function') {
          cb.call(null, err);
        } else {
          reject(err);
        }
      }

      req(url, function reqCallback(err, response, body) {
        var respObj;

        if (err) {
          failure(err);
        } else if (!response) {
          failure('No response (check internet connection)');
        } else if (response.statusCode !== 200) {
          parseXML(body, function parseXMLCallback(error, resp) {
            if (error) {
              failure(error);
            } else {
              failure(resp[method + 'ErrorResponse']);
            }
          });
        } else {
          parseXML(body, function parseXMLCallback(error, resp) {
            if (error) {
              failure(error);
            } else {
              respObj = resp[method + 'Response'];
              if (respObj.Items && respObj.Items.length > 0) {
                // Request Error
                if (respObj.Items[0].Request &&
                  respObj.Items[0].Request.length > 0 &&
                  respObj.Items[0].Request[0].Errors) {
                  failure(respObj.Items[0].Request[0].Errors);
                } else if (respObj.Items[0].Item) {
                  success(
                    respObj.Items[0].Item,
                    respObj.Items
                  );
                }
              } else if (respObj.BrowseNodes && respObj.BrowseNodes.length > 0) {
                // Request Error
                if (respObj.BrowseNodes[0].Request &&
                  respObj.BrowseNodes[0].Request.length > 0 &&
                  respObj.BrowseNodes[0].Request[0].Errors) {
                  failure(respObj.BrowseNodes[0].Request[0].Errors);
                } else if (respObj.BrowseNodes[0].BrowseNode) {
                  success(
                    respObj.BrowseNodes[0].BrowseNode,
                    respObj.BrowseNodes
                  );
                }
              }
            }
          });
        }
      });
    });

    if (typeof cb !== 'function') {
      return p;
    }

    return false;
  };
}

function createClient(credentials) {
  return {
    itemSearch: runQuery(credentials, 'ItemSearch'),
    itemLookup: runQuery(credentials, 'ItemLookup'),
    browseNodeLookup: runQuery(credentials, 'BrowseNodeLookup')
  };
}

exports.createClient = createClient;
