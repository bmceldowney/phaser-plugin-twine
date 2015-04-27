var chai = require('chai');
var should = chai.should();

describe('ifParser', function () {
  var ifParser;
  var text;
  var context;
  var macro;

  beforeEach(function () {
    macro = {
      "type": "if",
      "expression": "$reputation > 4",
      "startIndex": 12,
      "endIndex": 227,
      "innerStartIndex": 33,
      "content": "\nYou seem like just the type for this sort of thing.\n",
      "contentStart": 33,
      "macros": [],
      "links": [],
      "else": [
        {
          "macros": [],
          "links": [],
          "else": [],
          "type": "else",
          "expression": "$reputation < 0",
          "startIndex": 87,
          "endIndex": 112,
          "content": "\nOr maybe I'm better off asking someone else...\n"
        },
        {
          "macros": [],
          "links": [],
          "else": [],
          "type": "else",
          "expression": "$reputation == 3",
          "startIndex": 161,
          "endIndex": 168,
          "content": "\nI'm apprehensive, but willing to give you a try.\n"
        }
      ]
    }
    ifParser = require('../../js/ifParser.js');
  });

  describe('#parse', function () {
    it('should correctly parse a macro object', function () {
      var context = {
        reputation: -1
      };

      ifParser.parse(macro, context).should.equal(macro.else[0].content);;

      context.reputation = 3;
      ifParser.parse(macro, context).should.equal(macro.else[1].content);;

      context.reputation = 5;
      ifParser.parse(macro, context).should.equal(macro.content);;
 
      context.reputation = 2;
      ifParser.parse(macro, context).should.equal('');;
    });
  });

  describe('#_parseExpression', function () {
    it('should correctly parse "is"', function () {
      var expression = '$false is true';
      ifParser._parseExpression(expression).should.equal('context.false == true');

      expression = '$value is 5';
      ifParser._parseExpression(expression).should.equal('context.value == 5');

      expression = "$isclauseis is 'this is the is clause'";
      ifParser._parseExpression(expression).should.equal("context.isclauseis == 'this is the is clause'");

      expression = "$isclauseis is $isclauseis";
      ifParser._parseExpression(expression).should.equal("context.isclauseis == context.isclauseis");

      expression = "$isclauseis == 'this is my isclause'";
      ifParser._parseExpression(expression).should.equal("context.isclauseis == 'this is my isclause'");
    });

    it('should correctly parse "neq"', function () {
      var expression = '$neqClause neq "neq is soo uneqe"';
      ifParser._parseExpression(expression).should.equal('context.neqClause != "neq is soo uneqe"');
    });

    it('should correctly parse "gt"', function () {
      var expression = '$gtClause gt 5';
      ifParser._parseExpression(expression).should.equal('context.gtClause > 5');
    });

    it('should correctly parse "lt"', function () {
      var expression = '$ltClause lt 5';
      ifParser._parseExpression(expression).should.equal('context.ltClause < 5');
    });

    it('should correctly parse "and"', function () {
      var expression = '$value is "this and that" and $ltClause lt 5';
      ifParser._parseExpression(expression).should.equal('context.value == "this and that" && context.ltClause < 5');
    });

    it('should correctly parse "or"', function () {
      var expression = '$value is "this or that" or $ltClause lt 5';
      ifParser._parseExpression(expression).should.equal('context.value == "this or that" || context.ltClause < 5');
    });
  });

  describe('#_evaluateExpression', function () {
    it('should evaluate a string expression', function () {
      var context = {
        'false': false,
        'value': 5,
        'isclauseis': 'this is the is clause'
      };

      var expression = "context.isclauseis === 'this is the is clause'";
      ifParser._evaluateExpression(expression, context).should.equal(true);
    });
  });
});