var path = require('path');
var fs = require('fs');

function fixturePath(name) {
  return path.join(__dirname, '..', 'fixtures', name + '.xml');
}

function fixture(name) {
  var options = { flag: 'r', encoding: 'utf8' };
  return fs.readFileSync(fixturePath(name), options);
}

module.exports = { fixture, fixturePath };
