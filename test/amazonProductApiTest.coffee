amazonProductApi = require '../lib/index'

credentials =
  awsTag: process.env.AWS_TAG
  awsId: process.env.AWS_ID
  awsSecret: process.env.AWS_SECRET


describe "amazon-product-api", ->

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
