amazonProductApi = require '../lib/index'
generateQueryString = require('../lib/utils').generateQueryString
urlRegex = require './regex-weburl'

credentials =
  awsTag: process.env.AWS_TAG
  awsId: process.env.AWS_ID
  awsSecret: process.env.AWS_SECRET


describe 'generateQueryString(query, credentials)', ->

    it 'should return a string', ->

      queryString = generateQueryString
        keywords: 'Game of Thrones'
        searchIndex: 'DVD'
        responseGroup: 'Images,ItemAttributes'
      ,
        credentials

      queryString.should.be.a.String

      describe 'query string', ->
        it 'should be a valid url', ->
          queryString.should.match urlRegex

        it 'should include a valid timestamp', ->
          queryString.should.match /&Timestamp=([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?/

        it 'should include keywords', ->
          unescapedKeywords = /&Keywords=(.+?)&/.exec queryString
          keywords = decodeURIComponent unescapedKeywords[1]
          keywords.should.equal 'Game of Thrones'

        it 'should be signed', ->
          signature = decodeURIComponent((/&Signature=(.+)$/.exec queryString)[1])
          signature.should.match /[A-Fa-f0-9]*=$/


describe 'createClient(credentials)', ->
  it 'should return amazon product api client with item search method', ->
    client = amazonProductApi.createClient credentials
    client.should.have.property 'itemSearch'
    client.itemSearch.should.be.a.Function


describe 'client.itemSearch(query, cb)', ->

  describe 'when credentials are valid', ->
    client = amazonProductApi.createClient credentials

    describe 'when no callback is passed', ->

      it 'should return search results from amazon', ->
        client.itemSearch
          keywords: 'Pulp fiction'
          searchIndex: 'DVD'
          responseGroup: 'Offers'
        .then (results) ->
          results.should.be.an.Array

      it 'should work with custom domain', ->
        client.itemSearch
          keywords: 'Pulp fiction'
          searchIndex: 'DVD'
          responseGroup: 'Offers'
          domain: 'webservices.amazon.co.uk'
        .then (results) ->
          results.should.be.an.Array

    describe 'when callback is passed', ->
      it 'should return search results from amazon', ->
        client.itemSearch {keywords: 'Pulp fiction', searchIndex: 'DVD', responseGroup: 'Offers'}, (err, results) ->
          results.should.be.an.Array


  describe 'when credentials are invalid', ->
    client = amazonProductApi.createClient awsTag: 'sfsadf', awsId: 'sfadf', awsSecret: 'fsg'

    describe 'when no callback is passed', ->
      it 'should return an error', ->
        client.itemSearch
          keywords: 'Pulp fiction'
          searchIndex: 'DVD'
          responseGroup: 'Offers'
        .catch (err) ->
          err.should.be.an.Object
          err.should.have.property 'Error'


    describe 'when callback is passed', ->
      it 'should return an error', (done) ->
        client.itemSearch {keywords: 'Pulp fiction', searchIndex: 'DVD', responseGroup: 'Offers'}, (err, results) ->
          err.should.be.an.Object
          err.should.have.property 'Error'
          done()
