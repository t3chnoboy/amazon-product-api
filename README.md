# Node.js client for the Amazon Product Advertising API [![NPM version](https://badge.fury.io/js/amazon-product-api.png)](http://badge.fury.io/js/amazon-product-api) [![Dependency Status](https://gemnasium.com/t3chnoboy/amazon-product-api.png)](https://gemnasium.com/t3chnoboy/amazon-product-api) [![Build Status](https://travis-ci.org/t3chnoboy/amazon-product-api.png?branch=master)](https://travis-ci.org/t3chnoboy/amazon-product-api)


Promise-based Node.js client for the Amazon Product Advertising API

## Installation
[![NPM](https://nodei.co/npm/amazon-product-api.png?downloads=true)](https://nodei.co/npm/amazon-product-api/)

Install using npm:
```sh
npm install amazon-product-api
```

## Usage
```javascript
amazon = require('amazon-product-api');

var client = amazon.createClient({
	awsId: "awsId"",
	awsSecret: "awsSecret",
 	awsTag: "awsTag"
});

client.itemSearch({
	keywords: title,
	searchIndex: 'DVD',
    responseGroup: 'ItemAttributes,Offers,Images'
}).then(function(results){
	return res.send(results);
}).catch(function(error){
	return res.send(error);
});
```