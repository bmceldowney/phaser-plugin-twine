var chai = require('chai');
var should = chai.should();
var fs = require('fs');
var filename = 'data/forest_encounter.tw';
var importer = require('../../js/importer');

describe('build', function () {
	var rawData;

	beforeEach(function () {
		rawData = fs.readFileSync(filename, 'utf8');
	});

	it('should load a file', function () {
		var builtData = importer.build(rawData);

		builtData.passages[0].id.should.equal('Start');
		builtData.passages[1].id.should.equal('action oriented stuff rigth>>');
		builtData.passages.length.should.equal(10);
	});
});
