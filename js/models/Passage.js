var defaultPassage = {
	id: '',
	tags: [],
	content: ''
};

function get (rawData) {
	var retval = Object.create(defaultPassage);
	var tagStartIndex = rawData.indexOf('[');
	var firstNewLineIndex = rawData.indexOf('\n');

	var hasTags = tagStartIndex < firstNewLineIndex && tagStartIndex !== -1;

	if (hasTags) {
		retval.id = rawData.slice(0, tagStartIndex - 1);
		retval.tags = rawData.slice(tagStartIndex + 1, firstNewLineIndex - 1).split(' ');
	} else {
		retval.id = rawData.slice(0, firstNewLineIndex);
	}

	retval.content = rawData.slice(firstNewLineIndex + 1, rawData.length);

	return retval;
}

module.exports = {
	get: get
};
