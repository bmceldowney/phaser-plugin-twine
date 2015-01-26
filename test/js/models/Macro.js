var chai = require('chai');
var should = chai.should();

describe('Macro', function () {
  var Macro, macro;

  beforeEach(function () {
    Macro = require('../../../js/models/Macro');
    macro = Object.create(Macro);
    macro.init();
  });

  describe('convertContent', function () {
    var currentIf;

    beforeEach(function () {
    });

    it('should replace link content with the link text', function () {
      macro.content = ', d [[a link|link1]] and [[link2]]';
      macro.contentStart = 0;
      macro.links = [{
          startIndex: 4,
          endIndex: 20,
          text: 'a link'
        },{
          startIndex: 25,
          endIndex: 33,
          text: 'link2'
        }]

      macro.convertContent();
      macro.content.should.equal(', d [[0]] and [[1]]');
    });

    it('should replace macro content with placeholders', function () {
      macro.content = ', d<<if e>> f<<endif>> bah <<if anotherThing>>then some other stuff<<endif>>';
      macro.contentStart = 13;
      macro.macros = [{
          startIndex: 17,
          endIndex: 35
        },{
          startIndex: 41,
          endIndex: 89
        }]

      macro.convertContent();
      macro.content.should.equal(', d<<0>> bah <<1>>');
    });
  });
});