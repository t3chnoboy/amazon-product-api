var amazon = require('../lib');

var client = amazon.createClient({
  awsId: "AKIAJVU4RMDQ366PPLWA",
  awsSecret: "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",
  awsTag: "juancrg90me-20"
});

client.itemLookup({
  idType: 'UPC',
  itemId: '635753490879'
}, function(err, results) {
  if (err) {
    console.log(err);
  } else {
    console.log(results);
  }
});
