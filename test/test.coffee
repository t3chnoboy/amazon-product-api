amazonProductApi = require '../lib/index'

credentials =
  awsTag: process.env.AWS_TAG
  awsId: process.env.AWS_ID
  awsSecret: process.env.AWS_SECRET

describe 'createClient(credentials)', ->
  it 'should return amazon product api client with item search method', ->
    client = amazonProductApi.createClient credentials
    client.should.have.property 'itemSearch'
    client.itemSearch.should.be.a.Function

describe 'client.itemSearch', ->

  it 'should return search results from amazon when credentials are valid', ->
    client = amazonProductApi.createClient credentials
    client.itemSearch
      keywords: 'Pulp fiction',
      searchIndex: 'DVD',
      responseGroup: 'Offers'
    .then (results) ->
      results.should.be.an.Array

  it 'should throw an error when credentials are invalid', ->
    client = amazonProductApi.createClient awsTag: 'sfsadf', awsId: 'sfadf', awsSecret: 'fsg'
    client.itemSearch
      keywords: 'Pulp fiction',
      searchIndex: 'DVD',
      responseGroup: 'Offers'
    .catch (err) ->
      err.should.be.an.Object
      err.should.have.property 'ItemSearchErrorResponse'
