var crypto = require('crypto');

var generateSignature = function(stringToSign, awsSecret) {
  var hmac = crypto.createHmac('sha256', awsSecret);
  var signature = hmac.update(stringToSign).digest('base64');

  return signature;
};

var generateQueryString = {

  itemSearch: function(query, credentials) {
    var condition = query.condition || 'All';
    var keywords = query.keywords || '';
    var responseGroup = (query.responseGroup || 'ItemAttributes').replace(/,/g, '%2C');
    var searchIndex = query.searchIndex || 'All';
    var itemPage = query.itemPage || '1';
    var domain = query.domain || 'webservices.amazon.com';
    var unsignedString =
    "AWSAccessKeyId=" + credentials.awsId +
    "&AssociateTag=" + credentials.awsTag +
    "&Condition=" + condition +
    "&ItemPage=" + itemPage +
    "&Keywords=" + (encodeURIComponent(keywords)) +
    "&Operation=ItemSearch&ResponseGroup=" + responseGroup +
    "&SearchIndex=" + searchIndex +
    "&Service=AWSECommerceService&Timestamp=" + (encodeURIComponent((new Date()).toISOString())) +
    "&Version=2011-08-01";
    var signature = encodeURIComponent(generateSignature('GET\n' + domain + '\n/onca/xml\n' + unsignedString, credentials.awsSecret)).replace(/\+/g, '%2B');
    var queryString = 'http://' + domain + '/onca/xml?' + unsignedString + '&Signature=' + signature;

    return queryString;
  },

  itemLookup: function(query, credentials) {
    var condition = query.condition || 'All';
    var idType = query.idType || 'ASIN';
    var includeReviewsSummary = query.includeReviewsSummary || 'True';
    var itemId = query.itemId;
    var responseGroup = (query.responseGroup || 'ItemAttributes').replace(/,/g, '%2C');
    var searchIndex = query.searchIndex || 'All';
    var truncateReviewsAt = query.truncateReviewsAt || '1000';
    var variationPage = query.variationPage || 'All';
    var domain = query.domain || 'webservices.amazon.com';
    var unsignedString =
    "AWSAccessKeyId=" + credentials.awsId +
    "&AssociateTag=" + credentials.awsTag +
    "&Condition=" + condition +
    "&IdType=" + idType +
    "&IncludeReviewsSummary=" + includeReviewsSummary +
    "&ItemId=" + itemId +
    "&Operation=ItemLookup"+
    "&ResponseGroup=" + responseGroup +
    "&SearchIndex=" + searchIndex +
    "&Service=AWSECommerceService"+
    "&Timestamp=" + (encodeURIComponent((new Date()).toISOString())) +
    "&TruncateReviewsAt=" + truncateReviewsAt +
    "&VariationPage=" + variationPage +
    "&Version=2011-08-01";
    var signature = encodeURIComponent(generateSignature('GET\n' + domain + '\n/onca/xml\n' + unsignedString, credentials.awsSecret)).replace(/\+/g, '%2B');
    var queryString = 'http://' + domain + '/onca/xml?' + unsignedString + '&Signature=' + signature;

    return queryString;
  }

};

exports.generateQueryString = generateQueryString;
