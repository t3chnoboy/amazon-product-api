var amazon = require('../lib');
/* eslint-disable import/no-extraneous-dependencies */
var co = require('co');
/* eslint-enable import/no-extraneous-dependencies */

var client = amazon.createClient({
  awsTag: process.env.AWS_TAG,
  awsId: process.env.AWS_ID,
  awsSecret: process.env.AWS_SECRET,
});

co(function* fnCo() {
  var pulpFiction = client.itemSearch({
    keywords: 'Pulp fiction',
    searchIndex: 'DVD',
  });
  var killBill = client.itemSearch({
    keywords: 'Kill Bill',
    searchIndex: 'DVD',
  });
  var reservoirDogs = client.itemSearch({
    keywords: 'Reservoir Dogs',
    searchIndex: 'DVD',
  });

  var movies = yield [pulpFiction, killBill, reservoirDogs];
  console.log(movies);
})();
