var importer = require('./importer');
var lexer = require('./storyLexer');

function processRawData (rawData) {
	var retval = {
		passages: []
	};
	var story = importer.build(rawData);

	story.passages.forEach(function (passage) {
		var analyzedPassage = lexer.analyze(passage.content);
		analyzedPassage.id = passage.id;
		analyzedPassage.tags = passage.tags;
		retval.passages.push(analyzedPassage);
	});

	return retval;
}

module.exports = {
	processRawData: processRawData
}