http = require 'http'
crypto = require 'crypto'

awsId = process.env.AWS_ID
awsSecret = process.env.AWS_SECRET
awsTag = process.env.AWS_TAG

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
  timestamp = [year, month, day].join('-') + 'T' + [hours, mins, secs].join(':') + 'Z'


generateSignature = (stringToSign) ->
  secretKey = awsSecret
  hmac = crypto.createHmac 'sha256', secretKey
  hmac.update stringToSign
  hmac.digest 'base64'


generateQueryString = ->
  unsignedString = "
AWSAccessKeyId=#{awsId}
&AssociateTag=#{awsTag}
&Condition=All
&Keywords=#{escape 'alien 3'}
&Operation=ItemSearch
&ResponseGroup=ItemAttributes
&SearchIndex=All
&Service=AWSECommerceService
&Timestamp=#{escape generateTimestamp()}
&Version=2011-08-01
"
  signature = generateSignature 'GET\nwebservices.amazon.com\n/onca/xml\n' + unsignedString
  queryString = 'http://webservices.amazon.com/onca/xml?' + unsignedString + '&Signature=' + escape signature



http.get generateQueryString(), (res) ->
  res.on 'data', (chunk) ->
    console.log 'BODY: ' + chunk
.on 'error', (e) ->
  console.log "Got error: " + e.message
