var amazon = require('../lib');

var client = amazon.createClient({
  awsTag: process.env.AWS_TAG,
  awsId: process.env.AWS_ID,
  awsSecret: process.env.AWS_SECRET
});

client.itemLookup({
  idType: 'UPC',
  itemId: '635753490879',
  responseGroup: 'ItemAttributes,Offers,Images'
}, function itemLookupCallback(err, results) {
  if (err) {
    console.log(err); //eslint-disable-line
  } else {
    console.log(results); //eslint-disable-line
  }
});

