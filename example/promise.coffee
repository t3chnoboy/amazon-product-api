amazon = require '../lib'

client = amazon.createClient
   awsTag: process.env.AWS_TAG
   awsId: process.env.AWS_ID
   awsSecret: process.env.AWS_SECRET

client.itemSearch
  keywords: 'Pulp fiction',
  searchIndex: 'DVD',
  responseGroup: 'ItemAttributes,Offers,Images'
.then (results) ->
  console.log results
.catch (err) ->
    console.log err
