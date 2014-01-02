# Node.js client for the Amazon Product Advertising API [![NPM version](https://badge.fury.io/js/amazon-product-api.png)](http://badge.fury.io/js/amazon-product-api) [![Dependency Status](https://gemnasium.com/t3chnoboy/amazon-product-api.png)](https://gemnasium.com/t3chnoboy/amazon-product-api) [![Build Status](https://travis-ci.org/t3chnoboy/amazon-product-api.png?branch=master)](https://travis-ci.org/t3chnoboy/amazon-product-api)

Promise-based Node.js client for [Amazon Product Advertising API](https://affiliate-program.amazon.com/gp/advertising/api/detail/main.html)  

[![NPM](https://nodei.co/npm/amazon-product-api.png?downloads=true)](https://nodei.co/npm/amazon-product-api/)


The major differences between this project and other implementations are:

  1. Item search returns an [EcmaScript6 promise](https://github.com/domenic/promises-unwrapping). (Check out a great article about [ES6 promises](http://www.html5rocks.com/en/tutorials/es6/promises/))
  2. Item search is ["yieldable"](https://github.com/visionmedia/co#yieldables). So it plays well with fantastic next-gen libs such as [Koa](https://github.com/koajs/koa) and [Co](https://github.com/visionmedia/co). See [example](https://github.com/t3chnoboy/amazon-product-api#setup-your-own-server-that-doesnt-require-signatures-and-timestamp-and-returns-json)
  3. The entire codebase is very small (~90 LOC)



## Installation
Install using npm:
```sh
npm install amazon-product-api
```

## Usage

###Basic usage

Require library
```javascript
amazon = require('amazon-product-api');
```

Create client
```javascript
var client = amazon.createClient({
	awsId: "aws ID",
	awsSecret: "aws Secret",
 	awsTag: "aws Tag"
});
```

Now you can search for items on amazon like this:
```javascript
//search for Pulp Fiction dvd offers
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

###Search query options:

[condition:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemSearch.html) availiable options - 'All', 'New', 'Used', 'Refurbished', 'Collectible'. Defaults to 'All'  
[keywords:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemSearch.html) Defaults to ''  
[responseGroup:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/CHAP_ResponseGroupsList.html) You can use multiple values by separating them with comma (e.g responseGroup: 'ItemAttributes,Offers,Images'). Defaults to'ItemAttributes'  
[searchIndex:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/USSearchIndexParamForItemsearch.html) Defaults to 'All'.

##Example
###Setup your own server that doesn't require signatures and timestamp and returns JSON
```coffeescript
koa = require 'koa'
router = require 'koa-router'
amazonProductApi = require 'amazon-product-api' 

app = koa()
app.use router app

client = amazonProductApi.createClient
  awsTag: process.env.AWS_TAG
  awsId: process.env.AWS_ID
  awsSecret: process.env.AWS_SECRET
  
app.get '/amazon/:index', (next) ->*
  try
    searchResults = yield client.itemSearch
      keywords: @request.query.title
      searchIndex: @params.index
      responseGroup: 'ItemAttributes,Offers,Images'
    @body = searchResults
  catch error
    @body = error

app.listen process.env.PORT || 5000
```

Working demo:  
[Search for Alien DVDs](http://watchlist-koa.herokuapp.com/amazon/DVD?title=alien)  
[Search for Streets of Rage videogame](http://watchlist-koa.herokuapp.com/amazon/VideoGames?title=streets%20of%20rage)  
[Search for shoes](http://watchlist-koa.herokuapp.com/amazon/Shoes?title=nike%20nevis)
