var fs = require('fs');
var app = require('./js/app');

if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

var filename = process.argv[2];
var rawData = fs.readFileSync(filename, 'utf8');
var data = app.processRawData(rawData);

console.log(JSON.stringify(data));
