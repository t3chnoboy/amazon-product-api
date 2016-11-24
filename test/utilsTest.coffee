utils = require('../lib/utils')
urlRegex = require './regex-weburl'

credentials =
  awsTag: process.env.AWS_TAG
  awsId: process.env.AWS_ID
  awsSecret: process.env.AWS_SECRET


describe "utils", ->

  describe 'formatQueryParams(query, method, credentials)', ->
    it 'should return an object', ->
      queryParams = utils.formatQueryParams
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
        queryParams = utils.formatQueryParams({}, 'ItemSearch', credentials)

        queryParams.should.have.property('Condition', 'All');
        queryParams.should.have.property('Keywords', '');
        queryParams.should.have.property('ResponseGroup', 'ItemAttributes');
        queryParams.should.have.property('SearchIndex', 'All');
        queryParams.should.have.property('ItemPage', '1');
        queryParams.should.have.property('Version', '2013-08-01');

    describe 'ItemLookup', ->
      it 'should use default values and constants', ->
        queryParams = utils.formatQueryParams({}, 'ItemLookup', credentials)

        queryParams.should.have.property('Condition', 'All');
        queryParams.should.have.property('IdType', 'ASIN');
        queryParams.should.have.property('IncludeReviewsSummary', 'True');
        queryParams.should.have.property('ResponseGroup', 'ItemAttributes');
        queryParams.should.have.property('TruncateReviewsAt', '1000');
        queryParams.should.have.property('VariationPage', 'All');
        queryParams.should.have.property('Version', '2013-08-01');

    describe 'BrowseNodeLookup', ->
      it 'should use default values and constants', ->
        queryParams = utils.formatQueryParams({}, 'BrowseNodeLookup', credentials)

        queryParams.should.have.property('ResponseGroup', 'BrowseNodeInfo');
        queryParams.should.have.property('Version', '2013-08-01');


  describe 'generateQueryString(query, method, credentials)', ->
    queryString = utils.generateQueryString
      keywords: 'Game of Thrones'
      searchIndex: 'DVD'
      responseGroup: 'Images,ItemAttributes'
      ,
      'ItemSearch'
      ,
      credentials

    it 'should return a string', ->
      queryString.should.be.a.String

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
