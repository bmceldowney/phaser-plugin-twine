var chai = require('chai');
var should = chai.should();
var passages = require('../../../js/models/Passage');

describe('passage', function () {
	var passageRaw, content, noTags, noTagsContent;
	beforeEach(function () {
		passageRaw = "action oriented stuff rigth>> [thisTestTag anotherTag this tag [tag] <tag>]\n" +
		"Your hand moved subtly toward your weapon as you nonchalantly continue along the path. Suddenly two ruffians leap from behind a large shrub.\n" +
		"\n" +
		"[[Draw your weapon and attack before they know what's happening.|fight]]\n" +
		"[[Push past them and run as quickly as you can|run]] \n" +
		"\n\n";
		content = "Your hand moved subtly toward your weapon as you nonchalantly continue along the path. Suddenly two ruffians leap from behind a large shrub.\n" +
		"\n" +
		"[[Draw your weapon and attack before they know what's happening.|fight]]\n" +
		"[[Push past them and run as quickly as you can|run]] \n" +
		"\n\n";
		noTags = "Start\n" +
		"Walking along in the woods, you spy something out of the corner of your eye. <<if $perceptive>>You're pretty certain it's someone following you.<<endif>>";
		noTagsContent = "Walking along in the woods, you spy something out of the corner of your eye. <<if $perceptive>>You're pretty certain it's someone following you.<<endif>>";
	});

	describe('get', function () {
		it('should get a formatted passage', function () {
			var passage = passages.get(passageRaw);

			passage.id.should.equal('action oriented stuff rigth>>');
			passage.tags[0].should.equal('thisTestTag');
			passage.tags[5].should.equal('<tag>');
			passage.tags.length.should.equal(6);
			passage.content.should.equal(content);
		});

		it('should handle passages with on tags', function () {
			var passage = passages.get(noTags);

			passage.id.should.equal('Start');
			passage.tags.length.should.equal(0);
			passage.content.should.equal(noTagsContent);
		});
	});
});
