var chai = require('chai');
var should = chai.should();
var fs = require('fs');
var filename = 'data/forest_encounter.tw';
var app;

describe('app', function () {
	var rawData;

	beforeEach(function () {
		rawData = fs.readFileSync(filename, 'utf8');
		app = require('../../js/app');
	});

	it('processRawData', function () {
		var result = app.processRawData(rawData);
		// result.should.equal(2);
	});
});
