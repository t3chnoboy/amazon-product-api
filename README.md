# Node.js client for the Amazon Product Advertising API [![NPM version](https://badge.fury.io/js/amazon-product-api.png)](http://badge.fury.io/js/amazon-product-api) [![Dependency Status](https://gemnasium.com/t3chnoboy/amazon-product-api.png)](https://gemnasium.com/t3chnoboy/amazon-product-api) [![Build Status](https://travis-ci.org/t3chnoboy/amazon-product-api.png?branch=master)](https://travis-ci.org/t3chnoboy/amazon-product-api)


Promise-based Node.js client for the Amazon Product Advertising API
[![NPM](https://nodei.co/npm/amazon-product-api.png?downloads=true)](https://nodei.co/npm/amazon-product-api/)
## Installation
Install using npm:
```sh
npm install amazon-product-api
```

## Usage
```javascript
amazon = require('amazon-product-api');

var client = amazon.createClient({
	awsId: "aws ID",
	awsSecret: "aws Secret",
 	awsTag: "aws Tag"
});

client.itemSearch({
	keywords: 'Pulp fiction',
	searchIndex: 'DVD',
    responseGroup: 'ItemAttributes,Offers,Images'
}).then(function(results){
	console.log(results);
}).catch(function(error){
	console.log(error);
});
```