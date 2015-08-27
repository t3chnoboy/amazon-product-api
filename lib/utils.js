var crypto = require('crypto');

var generateSignature = function(stringToSign, awsSecret) {
    var hmac = crypto.createHmac('sha256', awsSecret);
    var signature = hmac.update(stringToSign).digest('base64');

    return signature;
};

var sort = function(object) {
    var sortedObject = {};
    var keys = Object.keys(object).sort();
    for (var i = 0; i < keys.length; i++) {
        sortedObject[keys[i]] = object[keys[i]];
    };
    return sortedObject;
}

var capitalize = function(string) {
    return string[0].toUpperCase() + string.slice(1)
}

var formatQueryParams = function(query, method, credentials) {
    var defaultParams = {};
    var params = {};

    // format query keys
    for (param in query) {
        var capitalized = capitalize(param);
        params[capitalized] = query[param];
    }

    if (method === 'ItemSearch') {
        // Default
        defaultParams['SearchIndex'] = 'All';
        defaultParams['Condition'] = 'All';
        defaultParams['ResponseGroup'] = 'ItemAttributes';
        defaultParams['Keywords'] = '';
        defaultParams['ItemPage'] = '1';
        // defaultParams['Sort'] = '';        

        for (param in defaultParams) {
            if (typeof params[param] == "undefined") {
                params[param] = defaultParams[param];
            }
        }

        // Constraints
        // if (params['SearchIndex'] == 'All') {
        //     params['SearchIndex'] = '';
        // }

        // Constants
        params['Version'] = '2013-08-01';

    } else if (method === 'ItemLookup') {
        // Default
        defaultParams['SearchIndex'] = 'All';
        defaultParams['Condition'] = 'All';
        defaultParams['ResponseGroup'] = 'ItemAttributes';
        defaultParams['IdType'] = 'ASIN';
        defaultParams['IncludeReviewsSummary'] = 'True';
        defaultParams['TruncateReviewsAt'] = '1000';
        defaultParams['VariationPage'] = 'All';        

        for (param in defaultParams) {
            if (typeof params[param] == "undefined") {
                params[param] = defaultParams[param];
            }
        }

        // Constraints    
        params['IdType'] === 'ASIN' ? '' : params['SearchIndex'];

        // Constants
        params['Version'] = '2011-08-01';
    
    } else if (method === 'BrowseNodeLookup') {
        // Default
        defaultParams['BrowseNodeId'] = '';
        defaultParams['ResponseGroup'] = 'BrowseNodeInfo';

        for (param in defaultParams) {
            if (typeof params[param] == "undefined") {
                params[param] = defaultParams[param];
            }
        }
    }

    // Common params  
    params['AWSAccessKeyId'] = credentials.awsId;
    params['AssociateTag'] = credentials.awsTag;
    params['Timestamp'] = new Date().toISOString();
    params['Service'] = 'AWSECommerceService';
    params['Operation'] = method;

    // sort
    params = sort(params);

    return params;
}

var generateQueryString = function(query, method, credentials) {
    var unsignedString = '';
    var domain = query.domain || 'webservices.amazon.com';    
    var params = formatQueryParams(query, method, credentials);

    // generate query
    unsignedString = Object.keys(params).map(function(key) {
        return key + "=" + encodeURIComponent(params[key]);
    }).join("&")

    var signature = encodeURIComponent(generateSignature('GET\n' + domain + '\n/onca/xml\n' + unsignedString, credentials.awsSecret)).replace(/\+/g, '%2B');
    var queryString = 'http://' + domain + '/onca/xml?' + unsignedString + '&Signature=' + signature;

    return queryString;
};

exports.generateQueryString = generateQueryString;
exports.formatQueryParams = formatQueryParams;