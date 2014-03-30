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

describe 'client.itemSearch(query, cb)', ->

  describe 'when no callback is passed', ->

    it 'should return search results from amazon when credentials are valid', ->
      client = amazonProductApi.createClient credentials
      client.itemSearch
        keywords: 'Pulp fiction',
        searchIndex: 'DVD',
        responseGroup: 'Offers'
      .then (results) ->
        results.should.be.a.String

    it 'should return an error when credentials are invalid', ->
      client = amazonProductApi.createClient awsTag: 'sfsadf', awsId: 'sfadf', awsSecret: 'fsg'
      client.itemSearch
        keywords: 'Pulp fiction',
        searchIndex: 'DVD',
        responseGroup: 'Offers'
      .catch (err) ->
        err.should.be.a.String

  describe 'when callback is passed', ->

    it 'should return search results from amazon when credentials are valid', ->
      client = amazonProductApi.createClient credentials
      client.itemSearch {keywords: 'Pulp fiction', searchIndex: 'DVD', responseGroup: 'Offers'}, (err, results) ->
        results.should.be.a.String

describe 'client.itemSearchStream(query)', ->
  it 'should return a stream', ->
    client = amazonProductApi.createClient credentials
    stream = client.itemSearchStream
      keywords: 'Pulp fiction'
      searchIndex: 'DVD'
      responseGroup: 'Offers'
    stream.should.have.property 'readable', true
