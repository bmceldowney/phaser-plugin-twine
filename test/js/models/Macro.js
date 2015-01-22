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
    var data = 'a<<if b is c>>, d<<if e>> f<<endif>> bah <<if anotherThing>>then some other stuff<<endif>><<endif>>';

    beforeEach(function () {
    	macro.content = ', d<<if e>> f<<endif>> bah <<if anotherThing>>then some other stuff<<endif>>';
      macro.contentStart = 13;
      macro.macros = [{
          startIndex: 17,
          endIndex: 35
        },{
          startIndex: 41,
          endIndex: 89
        }]
    });

    it('should replace macro content with placeholders', function () {
      macro.convertContent();
      macro.content.should.equal(', d<<0>> bah <<1>>');
    });
  });
});