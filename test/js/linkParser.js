var chai = require('chai');
var should = chai.should();

describe('linkParser', function () {
  var linkParser;
  var text;

  beforeEach(function () {
    linkParser = require('../../js/linkParser.js');
    text = "I've got a job for you, if you're looking.\n\n[[Sure|Description]]\n[[Not right now|End]]\n[[PassageTitle]]";
  });

  describe('#parse', function () {
    it('should extract links from text', function () {
      var links = linkParser.parse(text);

      links.length.should.equal(3);
      links[0].displayText.should.equal('Sure');
      links[0].passageTitle.should.equal('Description');
      links[1].displayText.should.equal('Not right now');
      links[1].passageTitle.should.equal('End');
      links[2].displayText.should.equal('PassageTitle');
      links[2].passageTitle.should.equal('PassageTitle');
    });
  });
});