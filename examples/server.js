var amazon = require('../'),
  koa = require('koa'),
  router = require('koa-router');

var app = koa();
var api = router();


var client = amazon.createClient({
  awsTag: process.env.AWS_TAG,
  awsId: process.env.AWS_ID,
  awsSecret: process.env.AWS_SECRET
});


app.get('/amazon/:index', function* () {
  this.body = yield client.itemSearch({
    keywords: this.query.title,
    searchIndex: this.params.index,
    responseGroup: 'ItemAttributes,Offers,Images'
  });
});

app
  .use(api.routes())
  .use(api.allowedMethods());

app.listen(3000);
