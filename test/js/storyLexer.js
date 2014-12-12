var chai = require('chai');
var should = chai.should();

describe('storyLexer', function () {
  var lexer;

  beforeEach(function () {
    lexer = require('../../js/storyLexer.js');

  });

  describe('#analyze', function () {
    it('should recognize the start of a macro', function should_recognize_the_start_of_a_macro() {
      var story = "a<<if b is c>>, d<<endif>>";
      var data = lexer.analyze(story);
      data.macros.length.should.equal(1);
      data.macros[0].type.should.equal('if');
      data.macros[0].expression.should.equal('b is c');
      data.macros[0].startIndex.should.equal(1);
      data.macros[0].endIndex.should.equal(25);
      data.macros[0].innerStartIndex.should.equal(13);      
      data.macros[0].innerEndIndex.should.equal(17);
    });

    it('should handle nested macros', function should_handle_nested_macros() {
      var story = "a<<if b is c>>, d<<if e>> f<<endif>><<endif>>";
      var data = lexer.analyze(story);

      data.macros.length.should.equal(1);
      data.macros[0].type.should.equal('if');
      data.macros[0].expression.should.equal('b is c');
      data.macros[0].startIndex.should.equal(1);
      data.macros[0].endIndex.should.equal(44);

      data.macros[0].macros.length.should.equal(1);
      data.macros[0].macros[0].type.should.equal('if');
      data.macros[0].macros[0].expression.should.equal('e');
      data.macros[0].macros[0].startIndex.should.equal(17);
      data.macros[0].macros[0].endIndex.should.equal(35);
    });

    it('should handle else macros', function should_handle_else_macros() {
      var story = "a<<if b is c>>d<<else>>e<<endif>>";
      var data = lexer.analyze(story);
      data.macros.length.should.equal(1);
      data.macros[0].type.should.equal('if');
      data.macros[0].expression.should.equal('b is c');
      data.macros[0].startIndex.should.equal(1);
      data.macros[0].endIndex.should.equal(32);

      data.macros[0].else.length.should.equal(1);
      data.macros[0].else[0].type.should.equal('else');
      data.macros[0].else[0].expression.should.equal('');
      data.macros[0].else[0].startIndex.should.equal(15);
      data.macros[0].else[0].endIndex.should.equal(22);
    });

    it('should handle else if macros', function should_handle_else_if_macros() {
      var story = "a<<if b is c>>d<<else if e neq 'f'>>g<<endif>>";
      var data = lexer.analyze(story);
      data.macros.length.should.equal(1);
      data.macros[0].type.should.equal('if');
      data.macros[0].expression.should.equal('b is c');
      data.macros[0].startIndex.should.equal(1);
      data.macros[0].endIndex.should.equal(45);

      data.macros[0].else.length.should.equal(1);
      data.macros[0].else[0].type.should.equal('else');
      data.macros[0].else[0].expression.should.equal("e neq 'f'");
      data.macros[0].else[0].startIndex.should.equal(15);
      data.macros[0].else[0].endIndex.should.equal(35);
    });

    it('should handle elseif macros', function should_handle_elseif_macros() {
      var story = "a<<if b is c>>d<<elseif e neq 'f'>>g<<endif>>";
      var data = lexer.analyze(story);
      data.macros.length.should.equal(1);
      data.macros[0].type.should.equal('if');
      data.macros[0].expression.should.equal('b is c');
      data.macros[0].startIndex.should.equal(1);
      data.macros[0].endIndex.should.equal(44);

      data.macros[0].else.length.should.equal(1);
      data.macros[0].else[0].type.should.equal('else');
      data.macros[0].else[0].expression.should.equal("e neq 'f'");
      data.macros[0].else[0].startIndex.should.equal(15);
      data.macros[0].else[0].endIndex.should.equal(34);
    });

    it('should not add else and endif macros', function () {
      var story = "a<<if b is c>>d<<elseif e>>f<<endif>>";
      var data = lexer.analyze(story);

      should.not.exist(data.macros['endif']);
      should.not.exist(data.macros['else']);
    });
  });

  xdescribe('temp', function temp() {
    it('should work', function () {
      var data = "a<<if b is c>>d<<if e>>f<<elseif g>>h<<else>>j<<endif>><<endif>>";
      var lex = lexer.analyze(data);

      console.log(JSON.stringify(lex));
    })
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
