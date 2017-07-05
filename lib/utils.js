var crypto = require('crypto');

function generateSignature(stringToSign, awsSecret) {
  var hmac = crypto.createHmac('sha256', awsSecret);
  var signature = hmac.update(stringToSign).digest('base64');

  return signature;
}

function sort(object) {
  var sortedObject = {};
  var keys = Object.keys(object).sort();
  var i;
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

  for (param in defaultParams) { //eslint-disable-line

    if (typeof params[param] === 'undefined') {
      params[param] = defaultParams[param];
    }
  }

  return params;
}

function formatQueryParams(query, method, credentials) {
  var params = {};
  var param;
  var capitalized;

  // format query keys
  for (param in query) { //eslint-disable-line
    if (Object.prototype.hasOwnProperty.call(query, param)) {
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
    // If ItemId is an ASIN (specified by IdType), a search index can't be specified in the request.
    if (params['IdType'] === 'ASIN') {
      delete params['SearchIndex'];
    }
  } else if (method === 'BrowseNodeLookup') {
    // Default
    params = setDefaultParams(params, {
      BrowseNodeId: '',
      ResponseGroup: 'BrowseNodeInfo'
    });
  }

  // Constants
  params['Version'] = '2013-08-01';

  // Common params
  params['AWSAccessKeyId'] = credentials.awsId;
  // awsTag is associated with domain, so it ought to be defineable in query.
  params['AssociateTag'] = query.awsTag || credentials.awsTag;
  params['Timestamp'] = new Date().toISOString();
  params['Service'] = 'AWSECommerceService';
  params['Operation'] = method;

  // sort
  params = sort(params);

  return params;
}

function generateQueryString(query, method, credentials) {
  var unsignedString = '';
  var signature = '';
  var queryString = '';
  var domain = query.domain || 'webservices.amazon.com';
  var params = formatQueryParams(query, method, credentials);
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
