var amazon = require('../lib');

var client = amazon.createClient({
  awsTag: process.env.AWS_TAG,
  awsId: process.env.AWS_ID,
  awsSecret: process.env.AWS_SECRET
});

client.browseNodeLookup({
  browseNodeId: '549726',
  responseGroup: 'NewReleases'
}, function browseNodeLookupCallback(err, results) {
  if (err) {
    console.log(err); //eslint-disable-line
  } else {
    console.log(results); //eslint-disable-line
  }
});
