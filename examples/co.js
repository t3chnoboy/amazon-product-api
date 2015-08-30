var amazon = require('../lib');
var co = require('co');

var client = amazon.createClient({
  awsTag: process.env.AWS_TAG,
  awsId: process.env.AWS_ID,
  awsSecret: process.env.AWS_SECRET
});

co(function* () {

  pulpFiction = client.itemSearch({
    keywords: 'Pulp fiction',
    searchIndex: 'DVD'
  });
  killBill = client.itemSearch({
    keywords: 'Kill Bill',
    searchIndex: 'DVD'
  });
  reservoirDogs = client.itemSearch({
    keywords: 'Reservoir Dogs',
    searchIndex: 'DVD'
  });

  movies = yield [pulpFiction, killBill, reservoirDogs];
  console.log(movies);

})();