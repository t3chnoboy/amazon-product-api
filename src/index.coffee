http = require 'http'
crypto = require 'crypto'
Promise = require('es6-promise').Promise
{parseString} = require 'xml2js'


generateTimestamp = ->
  addZero = (number) ->
    if 10 > number >= 0  then "0" + number
    else number + ""
  now = new Date()
  year = now.getUTCFullYear()
  month = addZero now.getUTCMonth() + 1
  day = addZero now.getUTCDate()
  hours = addZero now.getUTCHours()
  mins = addZero now.getUTCMinutes()
  secs = addZero now.getUTCSeconds()
  timestamp = [year, month, day].join('-') + 'T' + [hours, mins, secs].join(':') + '.000Z'


generateSignature = (stringToSign, awsSecret) ->
  hmac = crypto.createHmac 'sha256', awsSecret
  hmac.update(stringToSign).digest 'base64'


generateQueryString = (query, client) ->
  condition = query.condition || 'All'
  keywords = query.keywords || ''
  responseGroup = query.responseGroup || 'ItemAttributes'
  responseGroup = responseGroup.replace /,/g, '%2C'
  searchIndex = query.searchIndex || 'All'
  unsignedString = "
AWSAccessKeyId=#{client.awsId}
&AssociateTag=#{client.awsTag}
&Condition=#{condition}
&Keywords=#{escape keywords}
&Operation=ItemSearch
&ResponseGroup=#{responseGroup}
&SearchIndex=#{searchIndex}
&Service=AWSECommerceService
&Timestamp=#{escape generateTimestamp()}
&Version=2011-08-01"
  signature = generateSignature 'GET\nwebservices.amazon.com\n/onca/xml\n' + unsignedString, client.awsSecret
  signature = escape signature
  signature = signature.replace /\+/g, '%2B'
  queryString = 'http://webservices.amazon.com/onca/xml?' + unsignedString + '&Signature=' + signature


get = (url) ->

  new Promise (resolve, reject) ->

    request = http.get url, (response) ->

      responseData = ''
      response.on 'data', (chunk) ->
        responseData += chunk

      if response.statusCode is 200
        response.on 'end', ->
          parseString responseData, (error, result) ->
            if error?
              reject error
            else
              resolve result.ItemSearchResponse.Items[0].Item
      else
        response.on 'end', ->
          parseString responseData, (error, result) ->
            if error?
              reject error
            else
              reject result

    request.on 'error', (error) ->
      reject error


itemSearch = (client = {}) ->
  client.awsId = client.awsId || ''
  client.awsSecret = client.awsSecret || ''
  client.awsTag = client.awsTag || ''
  (query = {}) ->
    get generateQueryString query, client

createClient = (client) ->
  itemSearch: itemSearch client

exports.createClient = createClient
