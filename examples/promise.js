var amazon = require('../lib');

var client = amazon.createClient({
  awsTag: process.env.AWS_TAG,
  awsId: process.env.AWS_ID,
  awsSecret: process.env.AWS_SECRET
});

client.itemSearch({
  keywords: 'Pulp fiction',
  searchIndex: 'DVD',
  responseGroup: 'ItemAttributes,Offers,Images'
}).then(function (results) {
  console.log(results);
}).catch(function (err) {
  console.log(err);
});