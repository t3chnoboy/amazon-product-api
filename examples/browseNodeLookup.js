var amazon = require('../lib');

var client = amazon.createClient({
  awsTag: process.env.AWS_TAG,
  awsId: process.env.AWS_ID,
  awsSecret: process.env.AWS_SECRET
});

client.itemLookup({
      browseNodeId: '549726',
      responseGroup: 'NewReleases'
    }, function (err, results) {
      if (err) {
        console.log(err);
      } else {
        console.log(results);
      }