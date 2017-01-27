nock = require 'nock'
helper = require './support/testHelper'
amazonProductApi = require '../lib/index'

fixturePath = helper.fixturePath

createClient = () ->
  client = amazonProductApi.createClient
    awsTag: 'FAKE_AWS_TAG'
    awsId: 'FAKE_AWS_ID'
    awsSecret: 'FAKE_AWS_SECRET'


describe "amazon-product-api", ->

  describe 'createClient(credentials)', ->
    it 'should return amazon product api client with item search method', ->
      client = createClient()
      client.itemSearch.should.be.a.Function
      client.itemLookup.should.be.a.Function
      client.browseNodeLookup.should.be.a.Function


describe 'client.itemSearch(query, cb)', ->
  client = null
  query = null

  beforeEach ->
    client = createClient()
    query =
      keywords: 'Pulp fiction'
      searchIndex: 'DVD'
      responseGroup: 'Offers'

  describe 'when credentials are valid', ->

    beforeEach ->
      nock('https://webservices.amazon.com')
        .get('/onca/xml')
        .query(true)
        .replyWithFile(200, fixturePath('ItemSearchResponse'))

    describe 'when no callback is passed', ->
      it 'should return search results from amazon', () ->
        client.itemSearch(query)
          .then (results) ->
            results.should.be.an.Array

    describe 'when callback is passed', ->
      it 'should return search results from amazon', (done) ->
        client.itemSearch query, (error, results, response) ->
          (error == null).should.be.true
          results.should.be.an.Array
          response.should.be.an.Array
          done()


  describe 'when credentials are invalid', ->

    beforeEach ->
      nock('https://webservices.amazon.com')
        .get('/onca/xml')
        .query(true)
        .replyWithFile(403, fixturePath('ItemSearchErrorResponse'))

    describe 'when no callback is passed', ->
      it 'should return an error', () ->
        client.itemSearch(query)
          .catch (err) ->
            err.should.be.an.Object
            err.should.have.property 'Error'

    describe 'when callback is passed', ->
      it 'should return an error', (done) ->
        client.itemSearch query, (err, results) ->
          err.should.be.an.Object
          err.should.have.property 'Error'
          done()


describe 'client.itemLookup(query, cb)', ->
  client = null
  query = null

  beforeEach ->
    client = createClient()
    query =
      idType: 'UPC',
      itemId: '889030012227'

  describe 'when credentials are valid', ->

    beforeEach ->
      nock('https://webservices.amazon.com')
        .get('/onca/xml')
        .query(true)
        .replyWithFile(200, fixturePath('ItemLookupResponse'))

    describe 'when no callback is passed', ->
      it 'should return search results from amazon', () ->
        client.itemLookup(query)
        .then (results) ->
          results.should.be.an.Array

    describe 'when callback is passed', ->
      it 'should return search results from amazon', (done) ->
        client.itemLookup query, (err, results, response) ->
          results.should.be.an.Array
          response.should.be.an.Array
          done()

  describe 'when credentials are invalid', ->

    beforeEach ->
      nock('https://webservices.amazon.com')
        .get('/onca/xml')
        .query(true)
        .replyWithFile(403, fixturePath('ItemLookupErrorResponse'))

    describe 'when no callback is passed', ->
      it 'should return an error', () ->
        client.itemLookup(query)
        .catch (error) ->
          error.should.be.an.Object
          error.should.have.property 'Error'

    describe 'when callback is passed', ->
      it 'should return an error', (done) ->
        client.itemLookup query, (error, results, response) ->
          error.should.be.an.Object
          error.should.have.property 'Error'
          done()


describe 'client.browseNodeLookup(query, cb)', ->
  client = null
  query = null

  beforeEach ->
    client = createClient()
    query =
      browseNodeId: '549726',
      responseGroup: 'NewReleases'

  describe 'when credentials are valid', ->

    beforeEach ->
      nock('https://webservices.amazon.com')
        .get('/onca/xml')
        .query(true)
        .replyWithFile(200, fixturePath('BrowseNodeLookupResponse'))

    describe 'when no callback is passed', ->
      it 'should return search results from amazon', () ->
        client.browseNodeLookup(query)
        .then (results) ->
          results.should.be.an.Array

    describe 'when callback is passed', ->
      it 'should return search results from amazon', (done) ->
        client.browseNodeLookup query, (err, results, response) ->
          results.should.be.an.Array
          response.should.be.an.Array
          done()

  describe 'when credentials are invalid', ->

    beforeEach ->
      nock('https://webservices.amazon.com')
        .get('/onca/xml')
        .query(true)
        .replyWithFile(403, fixturePath('BrowseNodeLookupErrorResponse'))

    describe 'when no callback is passed', ->
      it 'should return an error', () ->
        client.browseNodeLookup(query)
        .catch (err) ->
          err.should.be.an.Object
          err.should.have.property 'Error'

    describe 'when callback is passed', ->
      it 'should return an error', (done) ->
        client.browseNodeLookup query, (err, results) ->
          err.should.be.an.Object
          err.should.have.property 'Error'
          done()
