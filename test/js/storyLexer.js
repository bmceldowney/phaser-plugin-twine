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
      data.macros[0].content.should.equal(', d');
    });

    it('should handle nested macros', function should_handle_nested_macros() {
      var story = "a <<if b is c>>, d <<if e>> f<<endif>>blartfast on the belfry<<endif>> thing happened <<if aThing>> blarve <<endif>> this too";
      var data = lexer.analyze(story);

      data.macros.length.should.equal(2);
      data.macros[0].type.should.equal('if');
      data.macros[0].expression.should.equal('b is c');
      data.macros[0].content.should.equal(', d <<0>>blartfast on the belfry');

      data.macros[0].macros.length.should.equal(1);
      data.macros[0].macros[0].type.should.equal('if');
      data.macros[0].macros[0].expression.should.equal('e');
      data.macros[0].macros[0].content.should.equal(' f');

      data.content.should.equal('a <<0>> thing happened <<1>> this too');
    });

    it('should handle else macros', function should_handle_else_macros() {
      var story = "the new start <<if blart>>a<<if b is c>>d<<else>>e<<endif>> and some text<<endif>>";
      var data = lexer.analyze(story);
      data.macros.length.should.equal(1);
      data.macros[0].type.should.equal('if');
      data.macros[0].expression.should.equal('blart');
      data.macros[0].content.should.equal('a<<0>> and some text');

      data.macros[0].macros[0].type.should.equal('if');
      data.macros[0].macros[0].expression.should.equal('b is c');
      data.macros[0].macros[0].content.should.equal('d');

      data.macros[0].macros[0].else.length.should.equal(1);
      data.macros[0].macros[0].else[0].type.should.equal('else');
      data.macros[0].macros[0].else[0].expression.should.equal('');
      data.macros[0].macros[0].else[0].content.should.equal('e');
    });

    it('should handle else if macros', function should_handle_else_if_macros() {
      var story = "a<<if b is c>>d<<else if e neq 'f'>>g<<endif>>";
      var data = lexer.analyze(story);
      data.macros.length.should.equal(1);
      data.macros[0].type.should.equal('if');
      data.macros[0].expression.should.equal('b is c');
      data.macros[0].content.should.equal('d');

      data.macros[0].else.length.should.equal(1);
      data.macros[0].else[0].type.should.equal('else');
      data.macros[0].else[0].expression.should.equal("e neq 'f'");
      data.macros[0].else[0].content.should.equal('g');
    });

    it('should handle elseif macros', function should_handle_elseif_macros() {
      var story = "a<<if b is c>>d<<elseif e neq 'f'>>g<<endif>>";
      var data = lexer.analyze(story);
      data.macros.length.should.equal(1);
      data.macros[0].type.should.equal('if');
      data.macros[0].expression.should.equal('b is c');
      data.macros[0].content.should.equal('d');

      data.macros[0].else.length.should.equal(1);
      data.macros[0].else[0].type.should.equal('else');
      data.macros[0].else[0].expression.should.equal("e neq 'f'");
      data.macros[0].else[0].content.should.equal('g');
    });

    it('should handle the > symbol', function () {
      var story = "a<<if b > c>>d<<elseif e>>f<<elseif g>>h<<else>>j<<endif>>";
      var data = lexer.analyze(story);

      data.macros[0].content.should.equal('d');
    })

    it('should not add else and endif macros', function () {
      var story = "a<<if b is c>>d<<elseif e>>f<<endif>>";
      var data = lexer.analyze(story);

      should.not.exist(data.macros['endif']);
      should.not.exist(data.macros['else']);
    });

    it('should handle links', function () {
      var story = "a<<if b is c>>d<<elseif e>>f<<endif>>[[link|location]]";
      var data = lexer.analyze(story);

      data.links.length.should.equal(1);
      data.links[0].text.should.equal('link');
      data.links[0].target.should.equal('location');
    });
  });

  describe('#lexLink', function () {
    it('should return a valid link object', function () {
      var story = "This is a story with a [[link|target]] and another [[link2]]";
      var index = 23;

      var link = lexer.lexLink(story, index);
      link.startIndex.should.equal(23);
      link.endIndex.should.equal(37);
      link.text.should.equal('link');
      link.target.should.equal('target');

      index = 51;
      link = lexer.lexLink(story, index);
      link.startIndex.should.equal(51);
      link.endIndex.should.equal(59);
      link.text.should.equal('link2');
      link.target.should.equal('link2');
    })
  })

  describe('#lexMacro', function () {
    it('should lex some stuff', function () {
      var story = "This is a test story with a <<testMacro>>";
      lexer.lexMacro(story, 28).type.should.equal('testMacro');

      story = "This is a test story with a <<if something is somethingElse>>, dogg <<endif>>";
      var macro = lexer.lexMacro(story, 28);
      macro.type.should.equal('if');
      macro.expression.should.equal('something is somethingElse');
      macro.startIndex.should.equal(28);
      macro.endIndex.should.equal(60);
    })
  });

  describe('#cleanUp', function () {
    it('should get rid of any non-essential properties', function () {
      var data = "This content<<if $spotty is 'bockchoy'>><<if $reputation > 4>>\nYou seem like just the type for this sort of thing.\n<<elseif $reputation < 0>>\nOr maybe I'm better off asking someone else...\n<<else>>\nI'm apprehensive, but willing to give you a try.\n<<endif>>This bockchoy is not NEARLY spotty enough.<<endif>>\n\n[[Why can’t you talk to him?|Why]]\n[[What’s it worth to you?|HowMuch]]\n";
      var lex = lexer.analyze(data);
      var clean = lexer.cleanUp(lex);

      clean.macros.forEach(function (macro) {
        should.not.exist(macro.startIndex);
        should.not.exist(macro.endIndex);
        should.not.exist(macro.contentStart);
      });
    });
  })

  xdescribe('--> PRINT', function temp() {
    it('OUT -->', function () {
      var data = "This content<<if $spotty is 'bockchoy'>><<if $reputation > 4>>\nYou seem like just the type for this sort of thing.\n<<elseif $reputation < 0>>\nOr maybe I'm better off asking someone else...\n<<else>>\nI'm apprehensive, but willing to give you a try.\n<<endif>>This bockchoy is not NEARLY spotty enough.<<endif>>\n\n[[Why can’t you talk to him?|Why]]\n[[What’s it worth to you?|HowMuch]]\n";
      var lex = lexer.analyze(data);

      console.log(JSON.stringify(lex));
    })
  });
});
