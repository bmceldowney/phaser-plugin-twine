var chai = require('chai');
var should = chai.should();

describe('storyLexer', function () {
  var lexer;

  beforeEach(function () {
    lexer = require('../../js/storyLexer.js');

  });

  describe('#analyze', function () {
    it('should recognize the start of a macro', function () {
      var story = "This is a test story with a <<if something is somethingElse>>, dogg <<endif>>";
      var data = lexer.analyze(story);
      data.macros['if'].length.should.equal(1);
      data.macros['if'][0].type.should.equal('if');
      data.macros['if'][0].expression.should.equal('something is somethingElse');
      data.macros['if'][0].startIndex.should.equal(28);
      data.macros['if'][0].endIndex.should.equal(76);
    });

    it('should handle nested macros', function () {
      var story = "This is a test story with a <<if something is somethingElse>>, dogg<<if nutz>> nutz<<endif>>!<<endif>>";
      var data = lexer.analyze(story);
      data.macros['if'].length.should.equal(2);
      data.macros['if'][0].type.should.equal('if');
      data.macros['if'][0].expression.should.equal('something is somethingElse');
      data.macros['if'][0].depth.should.equal(1);
      data.macros['if'][0].startIndex.should.equal(28);
      data.macros['if'][0].endIndex.should.equal(101);

      data.macros['if'][1].type.should.equal('if');
      data.macros['if'][1].expression.should.equal('nutz');
      data.macros['if'][1].depth.should.equal(2);
      data.macros['if'][1].startIndex.should.equal(67);
      data.macros['if'][1].endIndex.should.equal(91);
    });

    it('should handle else macros', function () {
      var story = "This is a test story with a, <<if something is somethingElse>>dogg!<<else>>nutz!<<endif>>";
      var data = lexer.analyze(story);
      data.macros['if'].length.should.equal(1);
      data.macros['if'][0].type.should.equal('if');
      data.macros['if'][0].expression.should.equal('something is somethingElse');
      data.macros['if'][0].startIndex.should.equal(29);
      data.macros['if'][0].endIndex.should.equal(88);

      data.macros['if'][0].else.length.should.equal(1);
      data.macros['if'][0].else[0].type.should.equal('else');
      data.macros['if'][0].else[0].expression.should.equal('');
      data.macros['if'][0].else[0].startIndex.should.equal(67);
      data.macros['if'][0].else[0].endIndex.should.equal(74);
    });

    it('should handle else if macros', function () {
      var story = "This is a test story with a, <<if something is somethingElse>>dogg!<<else if nutz neq 'real'>>nutz!<<endif>>";
      var data = lexer.analyze(story);
      data.macros['if'].length.should.equal(1);
      data.macros['if'][0].type.should.equal('if');
      data.macros['if'][0].expression.should.equal('something is somethingElse');
      data.macros['if'][0].startIndex.should.equal(29);
      data.macros['if'][0].endIndex.should.equal(107);

      data.macros['if'][0].else.length.should.equal(1);
      data.macros['if'][0].else[0].type.should.equal('else');
      data.macros['if'][0].else[0].expression.should.equal("nutz neq 'real'");
      data.macros['if'][0].else[0].startIndex.should.equal(67);
      data.macros['if'][0].else[0].endIndex.should.equal(93);
    });

    it('should handle elseif macros', function () {
      var story = "This is a test story with a, <<if something is somethingElse>>dogg!<<elseif nutz neq 'real'>>nutz!<<endif>>";
      var data = lexer.analyze(story);
      data.macros['if'].length.should.equal(1);
      data.macros['if'][0].type.should.equal('if');
      data.macros['if'][0].expression.should.equal('something is somethingElse');
      data.macros['if'][0].startIndex.should.equal(29);
      data.macros['if'][0].endIndex.should.equal(106);

      data.macros['if'][0].else.length.should.equal(1);
      data.macros['if'][0].else[0].type.should.equal('else');
      data.macros['if'][0].else[0].expression.should.equal("nutz neq 'real'");
      data.macros['if'][0].else[0].startIndex.should.equal(67);
      data.macros['if'][0].else[0].endIndex.should.equal(92);
    });

    it('should not add else and endif macros', function () {
      var story = "This is a test story with a, <<if something is somethingElse>>dogg!<<elseif nutz neq 'real'>>nutz!<<endif>>";
      var data = lexer.analyze(story);

      should.not.exist(data.macros['endif']);
      should.not.exist(data.macros['else']);
    });
  });

  describe('#_lexMacro', function () {
    it('should lex some stuff', function () {
      var story = "This is a test story with a <<testMacro>>";
      lexer._lexMacro(story, 28).type.should.equal('testMacro');

      story = "This is a test story with a <<if something is somethingElse>>, dogg <<endif>>";
      var macro = lexer._lexMacro(story, 28);
      macro.type.should.equal('if');
      macro.expression.should.equal('something is somethingElse');
      macro.startIndex.should.equal(28);
      macro.endIndex.should.equal(60);
    })
  });
});
