var Passage = require('./models/Passage');

function build (rawData) {
	var passages = [];
	var rawPassages = rawData.split(':: ');

	// first passage is blank due to the split
	rawPassages.shift();

	rawPassages.forEach(function (rawPassage) {
		passages.push(Passage.get(rawPassage));
	});

	return {
		passages: passages
	}
}

module.exports = {
	build: build
}