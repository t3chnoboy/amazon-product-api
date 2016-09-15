amazonProductApi = require '../lib/index'
generateQueryString = require('../lib/utils').generateQueryString
formatQueryParams = require('../lib/utils').formatQueryParams
urlRegex = require './regex-weburl'

credentials =
  awsTag: process.env.AWS_TAG
  awsId: process.env.AWS_ID
  awsSecret: process.env.AWS_SECRET


describe 'formatQueryParams(query, method, credentials)', ->
  it 'should return an object', ->
    queryParams = formatQueryParams
        artist: 'Muse'
        searchIndex: 'Music'
        responseGroup: 'Small,Offers,Images,ItemAttributes'
      ,
        'ItemSearch'
      ,
        credentials

      queryParams.should.be.an.Object

  describe 'ItemSearch', ->
    it 'should use default values and constants', ->
      queryParams = formatQueryParams({}, 'ItemSearch', credentials)

      queryParams.should.have.property('Condition', 'All');
      queryParams.should.have.property('Keywords', '');
      queryParams.should.have.property('ResponseGroup', 'ItemAttributes');
      queryParams.should.have.property('SearchIndex', 'All');
      queryParams.should.have.property('ItemPage', '1');
      queryParams.should.have.property('Version', '2013-08-01');

  describe 'ItemLookup', ->
    it 'should use default values and constants', ->
      queryParams = formatQueryParams({}, 'ItemLookup', credentials)

      queryParams.should.have.property('Condition', 'All');
      queryParams.should.have.property('IdType', 'ASIN');
      queryParams.should.have.property('IncludeReviewsSummary', 'True');
      queryParams.should.have.property('ResponseGroup', 'ItemAttributes');
      queryParams.should.have.property('TruncateReviewsAt', '1000');
      queryParams.should.have.property('VariationPage', 'All');
      queryParams.should.have.property('Version', '2013-08-01');

  describe 'BrowseNodeLookup', ->
    it 'should use default values and constants', ->
      queryParams = formatQueryParams({}, 'BrowseNodeLookup', credentials)

      queryParams.should.have.property('ResponseGroup', 'BrowseNodeInfo');
      queryParams.should.have.property('Version', '2013-08-01');


describe 'generateQueryString(query, method, credentials)', ->

    it 'should return a string', ->
      queryString = generateQueryString
        keywords: 'Game of Thrones'
        searchIndex: 'DVD'
        responseGroup: 'Images,ItemAttributes'
      ,
        'ItemSearch'
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
        client.itemSearch {keywords: 'Pulp fiction', searchIndex: 'DVD', responseGroup: 'Offers'}, (err, results, response) ->
          results.should.be.an.Array
          response.should.be.an.Array
          response[0].should.be.an.Object
          response[0].should.have.property 'Request'
          response[0]['Request'].should.be.an.Array
          response[0]['Request'][0].should.have.property('IsValid', ["True"])
          response[0]['Request'][0].should.have.property 'ItemSearchRequest'


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


describe 'client.itemLookup(query, cb)', ->

  describe 'when credentials are valid', ->
    client = amazonProductApi.createClient credentials

    describe 'when no callback is passed', ->
      it 'should return search results from amazon', ->
        client.itemLookup
          idType: 'UPC',
          itemId: '889030012227'
        .then (results) ->
          results.should.be.an.Array

      it 'should work with custom domain', ->
        client.itemLookup
          idType: 'UPC',
          itemId: '889030012227'
        .then (results) ->
          results.should.be.an.Array

    describe 'when callback is passed', ->
      it 'should return search results from amazon', ->
        client.itemLookup {idType: 'UPC', itemId: '889030012227'}, (err, results, response) ->
          results.should.be.an.Array
          response.should.be.an.Array
          response[0].should.be.an.Object
          response[0].should.have.property 'Request'
          response[0]['Request'].should.be.an.Array
          response[0]['Request'][0].should.have.property('IsValid', ["True"])
          response[0]['Request'][0].should.have.property 'ItemLookupRequest'


  describe 'when credentials are invalid', ->
    client = amazonProductApi.createClient awsTag: 'sfsadf', awsId: 'sfadf', awsSecret: 'fsg'

    describe 'when no callback is passed', ->
      it 'should return an error', ->
        client.itemLookup
          idType: 'UPC',
          itemId: '889030012227'
        .catch (err) ->
          err.should.be.an.Object
          err.should.have.property 'Error'

    describe 'when callback is passed', ->
      it 'should return an error', (done) ->
        client.itemLookup {idType: 'UPC', itemId: '889030012227'}, (err, results, response) ->
          err.should.be.an.Object
          err.should.have.property 'Error'
          done()


  describe 'when the request returns an error', ->
    client = amazonProductApi.createClient credentials

    describe 'when no callback is passed', ->
      it 'should return the errors inside the request node', ->
        client.itemLookup
          idType: 'ASIN',
          itemId: 'B00QTDTUVM'
        .catch (err) ->
          err.should.be.an.Array

    describe 'when callback is passed', ->
      it 'should return the errors inside the request node', ->
        client.itemLookup {idType: 'ASIN', itemId: 'B00QTDTUVM'}, (err, results) ->
          err.should.be.an.Array


describe 'client.browseNodeLookup(query, cb)', ->

  describe 'when credentials are valid', ->
    client = amazonProductApi.createClient credentials

    describe 'when no callback is passed', ->
      it 'should return search results from amazon', ->
        client.browseNodeLookup
          browseNodeId: '549726',
          responseGroup: 'NewReleases'
        .then (results) ->
          results.should.be.an.Array

      it 'should work with custom domain', ->
        client.browseNodeLookup
          browseNodeId: '549726',
          responseGroup: 'NewReleases'
        .then (results) ->
          results.should.be.an.Array

    describe 'when callback is passed', ->
      it 'should return search results from amazon', ->
        client.browseNodeLookup {browseNodeId: '549726', responseGroup: 'NewReleases'}, (err, results, response) ->

          results.should.be.an.Array
          response.should.be.an.Array
          response[0].should.be.an.Object
          response[0].should.have.property 'Request'
          response[0]['Request'].should.be.an.Array
          response[0]['Request'][0].should.have.property('IsValid', ["True"])
          response[0]['Request'][0].should.have.property 'BrowseNodeLookupRequest'


  describe 'when credentials are invalid', ->
    client = amazonProductApi.createClient awsTag: 'sfsadf', awsId: 'sfadf', awsSecret: 'fsg'

    describe 'when no callback is passed', ->
      it 'should return an error', ->
        client.browseNodeLookup
          browseNodeId: '549726',
          responseGroup: 'NewReleases'
        .catch (err) ->
          err.should.be.an.Object
          err.should.have.property 'Error'

    describe 'when callback is passed', ->
      it 'should return an error', (done) ->
        client.browseNodeLookup {browseNodeId: '549726', responseGroup: 'NewReleases'}, (err, results) ->
          err.should.be.an.Object
          err.should.have.property 'Error'
          done()


  describe 'when the request returns an error', ->
    client = amazonProductApi.createClient credentials

    describe 'when no callback is passed', ->
      it 'should return the errors inside the request node', ->
        client.browseNodeLookup
          browseNodeId: '102340',
          responseGroup: 'NewReleases'
        .catch (err) =>
          err.should.be.an.Array
          err[0].should.be.an.Object
          err[0].should.have.property 'Error'

    describe 'when callback is passed', ->
      it 'should return the errors inside the request node', ->
        client.browseNodeLookup {browseNodeId: '102340', responseGroup: 'NewReleases'}, (err, results) ->
          err.should.be.an.Array
          err[0].should.be.an.Object
          err[0].should.have.property 'Error'


describe 'escape rfc 3986 reserved chars', ->
    client = amazonProductApi.createClient credentials

    it 'should return search results from amazon', ->
      client.itemSearch
        keywords: "Ender's Game"
        searchIndex: 'DVD'
        responseGroup: 'Offers'
      .then (results) ->
        results.should.be.an.Array
