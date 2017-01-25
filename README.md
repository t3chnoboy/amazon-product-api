# Node.js client for the Amazon Product Advertising API

[![NPM version](https://badge.fury.io/js/amazon-product-api.svg)](http://badge.fury.io/js/amazon-product-api) [![Dependency Status](https://gemnasium.com/t3chnoboy/amazon-product-api.svg)](https://gemnasium.com/t3chnoboy/amazon-product-api) [![Build Status](https://travis-ci.org/t3chnoboy/amazon-product-api.svg?branch=master)](https://travis-ci.org/t3chnoboy/amazon-product-api)

Node.js client for [Amazon Product Advertising API](https://affiliate-program.amazon.com/gp/advertising/api/detail/main.html)
![alt text](http://i.imgur.com/MwfPRfB.gif "Logo Title Text 1")

[![NPM](https://nodei.co/npm/amazon-product-api.png?downloads=true)](https://nodei.co/npm/amazon-product-api/)


## Installation
Install using npm:
```sh
npm install amazon-product-api
```

Install in Meteor:
```sh
meteor add quackware:amazon-product-api
```


## Usage

Require library
```javascript
var amazon = require('amazon-product-api');
```

Create client
```javascript
var client = amazon.createClient({
  awsId: "aws ID",
  awsSecret: "aws Secret",
  awsTag: "aws Tag"
});
```
Now you are ready to use the API!


### ItemSearch

> The ItemSearch operation searches for items on Amazon. The Product Advertising API returns up to ten items per search results page.

[📖 Documentation](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemSearch.html)

Using promises:
```javascript
client.itemSearch({
  director: 'Quentin Tarantino',
  actor: 'Samuel L. Jackson',
  searchIndex: 'DVD',
  audienceRating: 'R',
  responseGroup: 'ItemAttributes,Offers,Images'
}).then(function(results){
  console.log(results);
}).catch(function(err){
  console.log(err);
});
```

Using a callback:
```javascript
client.itemSearch({
  director: 'Quentin Tarantino',
  actor: 'Samuel L. Jackson',
  searchIndex: 'DVD',
  audienceRating: 'R',
  responseGroup: 'ItemAttributes,Offers,Images'
}, function(err, results, response) {
  if (err) {
    console.log(err);
  } else {
    console.log(results);  // products (Array of Object)
    console.log(response); // response (Array where the first element is an Object that contains Request, Item, etc.)
  }
});
```

using ecmascript6 generators and co:
```javascript
var co = require('co');

co(function *(){

  pulpFiction   = client.itemSearch({ keywords: 'Pulp fiction',   searchIndex: 'DVD'});
  killBill      = client.itemSearch({ keywords: 'Kill Bill',      searchIndex: 'DVD'});
  reservoirDogs = client.itemSearch({ keywords: 'Reservoir Dogs', searchIndex: 'DVD'});

  movies = yield [pulpFiction, killBill, reservoirDogs];
  console.log(movies);

})();
```

#### Query params:

You can add any [available params](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemSearch.html) for the *itemSearch* method:

- [condition:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemSearch.html) availiable options - 'All', 'New', 'Used', 'Refurbished', 'Collectible'. Defaults to 'All'.

- [keywords:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemSearch.html) Defaults to ''

- [responseGroup:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/CHAP_ResponseGroupsList.html) You can use multiple values by separating them with comma (e.g responseGroup: 'ItemAttributes,Offers,Images'). Defaults to'ItemAttributes'

- [searchIndex:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/USSearchIndexParamForItemsearch.html) Defaults to 'All'.

- [itemPage:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemSearch.html) Defaults to '1'.

- [sort](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/SortingbyPopularityPriceorCondition.html): Valid values include 'salesrank','psrank','titlerank','-price','price', etc.


### ItemLookup

> Given an Item identifier, the ItemLookup operation returns some or all of the item attributes, depending on the response group specified in the request.

[📖 Documentation](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemLookup.html)

Using promises:
```javascript
client.itemLookup({
  idType: 'UPC',
  itemId: '884392579524'
}).then(function(results) {
  console.log(JSON.stringify(results));
}).catch(function(err) {
  console.log(err);
});
```

Using a callback:
```javascript
client.itemLookup({
  idType: 'UPC',
  itemId: '635753490879',
  responseGroup: 'ItemAttributes,Offers,Images'
}, function(err, results, response) {
  if (err) {
    console.log(err);
  } else {
    console.log(results);
  }
});
```

#### Query params:

You can add any [available params](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemLookup.html) for the *ItemLookup* method.

- [condition:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemLookup.html) availiable options - 'All', 'New', 'Used', 'Refurbished', 'Collectible'. Defaults to 'All'.

- [idType:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemLookup.html) Type of item identifier used to look up an item. Availiable options - 'ASIN', 'SKU', 'UPC', 'EAN', 'ISBN'. Defaults to 'ASIN'.

- [includeReviewsSummary:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemLookup.html) availiable options - 'True','False'. Defaults to 'True'.

- [itemId:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemLookup.html) One or more (up to ten) positive integers that uniquely identify an item.

- [responseGroup:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/CHAP_ResponseGroupsList.html) You can use multiple values by separating them with comma (e.g responseGroup: 'ItemAttributes,Offers,Images'). Defaults to'ItemAttributes'.

- [searchIndex:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/USSearchIndexParamForItemsearch.html) Defaults to 'All'.

- [truncateReviewsAt:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/CHAP_ResponseGroupsList.html) Defaults to '1000'. To return complete reviews, specify '0'.

- [variationPage:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/CHAP_ResponseGroupsList.html) Defaults to 'All'.
domain: Defaults to 'webservices.amazon.com'.


### BrowseNodeLookup

> Given a browse node ID, BrowseNodeLookup returns the specified browse node’s name, children, and ancestors. The names and browse node IDs of the children and ancestor browse nodes are also returned. BrowseNodeLookup enables you to traverse the browse node hierarchy to find a browse node.

[📖 Documentation](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/BrowseNodeLookup.html)

Using promises:
```javascript
client.browseNodeLookup({
  browseNodeId: '549726',
  responseGroup: 'NewReleases'
}).then(function(results) {
  console.log(results);
}).catch(function(err) {
  console.log(err);
});
```

Using a callback:
```javascript
client.browseNodeLookup({
  browseNodeId: '549726',
  responseGroup: 'NewReleases'
}, function(err, results, response) {
  if (err) {
    console.log(err);
  } else {
    console.log(results);
  }
});
```

#### Query params:

You can add any [available params](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/BrowseNodeLookup.html) for the *BrowseNodeLookup* method.

- [browseNodeId:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/BrowseNodeLookup.html) A positive integer assigned by Amazon that uniquely identifies a product category.

- [responseGroup:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/CHAP_ResponseGroupsList.html) You can use multiple values by separating them with comma (e.g responseGroup: 'MostGifted,NewReleases,MostWishedFor,TopSellers'). Defaults to 'BrowseNodeInfo'.


## Specify the endpoint

To use a different endpoint, you need the choose it from the [endpoints list](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/AnatomyOfaRESTRequest.html#EndpointsandWebServices), then pass the **domain** of the endpoint URL to the `domain` param of your query.

By default, the domaine used is `webservices.amazon.com`.

#### Example:

I want to query the Canadian store 🇨🇦 .
The endpoint URL is https://webservices.amazon.ca/onca/xml.
The **domain** of the endpoint is `webservices.amazon.ca`.

```javascript
var query = {
  artist: 'Radiohead',
  searchIndex: 'Music',
  sort: 'relevancerank',
  itemPage: 1,
  availability: 'Available',
  responseGroup: 'OfferFull,Large,Images',
  domain: 'webservices.amazon.ca'
};

client.itemSearch(query, function (error, results) {
  if (error) {
    console.log(error);
  } else {
    console.log(results);
  }
})
```


## Passing a custom `request`

You can pass a custom `request` function to be used, for example if you are throttling requests.

```javascript
var request = require('request');
var throttledRequest = require('throttled-request')(request);

client.itemSearch({
  request: throttledRequest
  // ...
});
```


## Example

Setup your own server that doesn't require signatures and timestamp.

```javascript
var amazon = require('amazon-product-api'),
    koa = require('koa'),
    router = require('koa-router');

var app = koa();
app.use(router(app));


var client = amazon.createClient({
  awsTag: process.env.AWS_TAG,
  awsId: process.env.AWS_ID,
  awsSecret: process.env.AWS_SECRET
});


app.get('/amazon/:index', function* (){
  this.body = yield client.itemSearch({
    keywords: this.query.title,
    searchIndex: this.params.index,
    responseGroup: 'ItemAttributes,Offers,Images'
  });
});

app.listen(3000);
```

Working demo:
- [Search for Alien DVDs](http://watchlist-koa.herokuapp.com/amazon/DVD?title=alien) | [Mirror](https://juancrg90-watchlist-koa.herokuapp.com/amazon/DVD?title=alien)
- [Search for Streets of Rage videogame](http://watchlist-koa.herokuapp.com/amazon/VideoGames?title=streets%20of%20rage) | [Mirror](https://juancrg90-watchlist-koa.herokuapp.com/amazon/VideoGames?title=streets%20of%20rage)
- [Search for shoes](http://watchlist-koa.herokuapp.com/amazon/Shoes?title=nike) | [Mirror](https://juancrg90-watchlist-koa.herokuapp.com/amazon/Shoes?title=nike)
