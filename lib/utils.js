var crypto = require('crypto');

var generateSignature = function (stringToSign, awsSecret) {
  var hmac = crypto.createHmac('sha256', awsSecret);
  var signature = hmac.update(stringToSign).digest('base64');

  return signature;
};

var sort = function (object) {
  var sortedObject = {};
  var keys = Object.keys(object).sort();
  for (var i = 0; i < keys.length; i++) {
    sortedObject[keys[i]] = object[keys[i]];
  };
  return sortedObject;
}

var capitalize = function (string) {
  return string[0].toUpperCase() + string.slice(1)
}

var setDefaultParams = function (params, defaultParams) {
  for (var param in defaultParams) {
    if (typeof params[param] === 'undefined') {
      params[param] = defaultParams[param];
    }
  }
  return params;
}

var formatQueryParams = function (query, method, credentials) {
  var params = {};

  // format query keys
  for (var param in query) {
    var capitalized = capitalize(param);
    params[capitalized] = query[param];
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
    // If ItemId is an ASIN (specified by IdType), a search index cannot be specified in the request.
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

var generateQueryString = function (query, method, credentials) {
  var unsignedString = '';
  var domain = query.domain || 'webservices.amazon.com';
  var params = formatQueryParams(query, method, credentials);

  // generate query
  unsignedString = Object.keys(params).map(function (key) {
    return key + "=" + encodeURIComponent(params[key]).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }).join("&")

  var signature = encodeURIComponent(generateSignature('GET\n' + domain + '\n/onca/xml\n' + unsignedString, credentials.awsSecret)).replace(/\+/g, '%2B');
  var queryString = 'https://' + domain + '/onca/xml?' + unsignedString + '&Signature=' + signature;

  return queryString;
};

exports.generateQueryString = generateQueryString;
exports.formatQueryParams = formatQueryParams;
