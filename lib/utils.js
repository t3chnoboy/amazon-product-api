var crypto = require('crypto');

var generateSignature = function(stringToSign, awsSecret) {
  var hmac = crypto.createHmac('sha256', awsSecret);
  var signature = hmac.update(stringToSign).digest('base64');

  return signature;
};

var generateQueryString = function(query, method, credentials) {

  var unsignedString;
  var domain = query.domain || 'webservices.amazon.com';
  var searchIndex = query.searchIndex || 'All';
  var responseGroup = (query.responseGroup || 'ItemAttributes').replace(/,/g, '%2C');
  var condition = query.condition || 'All';

  if (method === 'ItemSearch') {
    var keywords = query.keywords || '';
    var itemPage = query.itemPage || '1';
    var sort = query.sort || '';
    var minimumPrice = query.minimumPrice || '';
    var maximumPrice = query.maximumPrice || '';
    
    sort = (searchIndex === 'All' || sort === '') ? '' : "&Sort=" + sort
    
    unsignedString =
    "AWSAccessKeyId=" + credentials.awsId +
    "&AssociateTag=" + credentials.awsTag +
    "&Condition=" + condition +
    "&ItemPage=" + itemPage +
    "&Keywords=" + (encodeURIComponent(keywords)) +
    "&MaximumPrice=" + maximumPrice +
    "&MinimumPrice=" + minimumPrice +
    "&Operation=ItemSearch&ResponseGroup=" + responseGroup +
    "&SearchIndex=" + searchIndex +
    "&Service=AWSECommerceService"+
    sort +
    "&Timestamp=" + (encodeURIComponent((new Date()).toISOString())) +
    "&Version=2013-08-01";
  } else if (method === 'ItemLookup') {
    var idType = query.idType || 'ASIN';
    var includeReviewsSummary = query.includeReviewsSummary || 'True';
    var itemId = encodeURIComponent(query.itemId);
    var truncateReviewsAt = query.truncateReviewsAt || '1000';
    var variationPage = query.variationPage || 'All';
    searchIndex = (idType ==='ASIN') ? '' : '&SearchIndex='+ searchIndex;
    unsignedString =
    "AWSAccessKeyId=" + credentials.awsId +
    "&AssociateTag=" + credentials.awsTag +
    "&Condition=" + condition +
    "&IdType=" + idType +
    "&IncludeReviewsSummary=" + includeReviewsSummary +
    "&ItemId=" + itemId +
    "&Operation=ItemLookup"+
    "&ResponseGroup=" + responseGroup +
    searchIndex +
    "&Service=AWSECommerceService"+
    "&Timestamp=" + (encodeURIComponent((new Date()).toISOString())) +
    "&TruncateReviewsAt=" + truncateReviewsAt +
    "&VariationPage=" + variationPage +
    "&Version=2011-08-01";
  }

  var signature = encodeURIComponent(generateSignature('GET\n' + domain + '\n/onca/xml\n' + unsignedString, credentials.awsSecret)).replace(/\+/g, '%2B');
  var queryString = 'http://' + domain + '/onca/xml?' + unsignedString + '&Signature=' + signature;
  
  return queryString;
};

exports.generateQueryString = generateQueryString;
