var chai = require('chai');
var should = chai.should();

describe('ifParser', function () {
  var ifParser;
  var text;
  var context;

  beforeEach(function () {
    var data = {
      lexedData: {
        "macros":[
        {
          "type":"if",
          "expression":"b is c",
          "startIndex":1,
          "endIndex":65,
          "innerStartIndex":13,
          "innerEndIndex":57,
          "macros":[
          {
            "type":"if",
            "expression":"e",
            "startIndex":15,
            "endIndex":56,
            "innerStartIndex":22,
            "innerEndIndex":48,
            "else":[
            {
              "type":"else",
              "expression":"g",
              "startIndex":24,
              "endIndex":35
            },
            {
              "type":"else",
              "expression":"",
              "startIndex":37,
              "endIndex":46
            }]
          }]
        }]
      },
      originalString: "a<<if b is c>>d<<if e>>f<<elseif g>>h<<else>>j<<endif>><<endif>>"
    };

    ifParser = require('../../js/ifParser.js');
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