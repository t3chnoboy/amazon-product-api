var crypto = require('crypto');

function generateSignature(stringToSign, awsSecret) {
  var hmac = crypto.createHmac('sha256', awsSecret);
  var signature = hmac.update(stringToSign).digest('base64');

  return signature;
}

function sort(object) {
  var sortedObject = {};
  var keys = Object.keys(object).sort();
  var i = 0;

  for (i = 0; i < keys.length; i += 1) {
    sortedObject[keys[i]] = object[keys[i]];
  }

  return sortedObject;
}

function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function setDefaultParams(params, defaultParams) {
  var param;

  for (param in defaultParams) { // eslint-disable-line no-restricted-syntax
    if (typeof params[param] === 'undefined') {
      // eslint-disable-next-line no-param-reassign
      params[param] = defaultParams[param];
    }
  }
  return params;
}

function formatQueryParams(query, method, credentials) {
  var capitalized;
  var param;
  var params = {};

  // format query keys
  for (param in query) { // eslint-disable-line no-restricted-syntax
    if (Object.prototype.hasOwnProperty.call(query, param) && query[param] !== undefined) {
      capitalized = capitalize(param);
      params[capitalized] = query[param];
    }
  }

  if (method === 'ItemSearch') {
    // Default
    params = setDefaultParams(params, {
      SearchIndex: 'All',
      Condition: 'All',
      ResponseGroup: 'ItemAttributes',
      Keywords: '',
      ItemPage: '1'
    });
  } else if (method === 'ItemLookup') {
    // Default
    params = setDefaultParams(params, {
      SearchIndex: 'All',
      Condition: 'All',
      ResponseGroup: 'ItemAttributes',
      IdType: 'ASIN',
      IncludeReviewsSummary: 'True',
      TruncateReviewsAt: '1000',
      VariationPage: 'All'
    });

    // Constraints
    // If ItemId is an ASIN (specified by IdType), a search index cannot be
    // specified in the request.
    if (params.IdType === 'ASIN') {
      delete params.SearchIndex;
    }
  } else if (method === 'BrowseNodeLookup') {
    // Default
    params = setDefaultParams(params, {
      BrowseNodeId: '',
      ResponseGroup: 'BrowseNodeInfo'
    });
  }


  // Constants
  params.Version = '2013-08-01';

  // Common params
  params.AWSAccessKeyId = credentials.awsId;
  // awsTag is associated with domain, so it ought to be defineable in query.
  params.AssociateTag = query.awsTag || credentials.awsTag;
  params.Timestamp = new Date().toISOString();
  params.Service = 'AWSECommerceService';
  params.Operation = method;

  // sort
  params = sort(params);

  return params;
}

function generateQueryString(query, method, credentials) {
  var unsignedString = '';
  var domain = query.domain || 'webservices.amazon.com';
  var params = formatQueryParams(query, method, credentials);
  var signature;
  var queryString;

  // generate query
  unsignedString = Object.keys(params).map(function mapCallback(key) {
    return key + '=' + encodeURIComponent(params[key]).replace(/[!'()*]/g, function replaceCallback(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }).join('&');

  signature = encodeURIComponent(generateSignature('GET\n' + domain + '\n/onca/xml\n' + unsignedString, credentials.awsSecret)).replace(/\+/g, '%2B');
  queryString = 'https://' + domain + '/onca/xml?' + unsignedString + '&Signature=' + signature;

  return queryString;
}

exports.generateQueryString = generateQueryString;
exports.formatQueryParams = formatQueryParams;
