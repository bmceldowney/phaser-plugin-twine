var chai = require('chai');
var should = chai.should();

describe('ifParser', function () {
  var ifParser;
  var text;
  var context;

  beforeEach(function () {
    ifParser = require('../../js/ifParser.js');
    text = 'This is a test. <<if $conditional>>This is conditional text.<<endif>>';
    context = { '$conditional': false };
  });

  xdescribe('#parse', function () {
    it('should remove text if conditional is false', function () {
      var result = ifParser.parse(text, context);

      result.should.equal('This is a test. ');
    });
  });
  
  describe('#_getCondition', function () {
    it('should return the condition of the if block', function () {
      var ifBlock = '<<if $condition is true>>SOme text is in here.<<endif>>';
      var condition = ifParser._getCondition(ifBlock);
      condition.should.equal('$condition is true');
    });
  });

  describe('#_parseCondition', function () {
    it('should correctly parse "is"', function () {
      var condition = '$false is true';
      ifParser._parseCondition(condition).should.equal('context.false == true');

      condition = '$value is 5';
      ifParser._parseCondition(condition).should.equal('context.value == 5');

      condition = "$isclauseis is 'this is the is clause'";
      ifParser._parseCondition(condition).should.equal("context.isclauseis == 'this is the is clause'");

      condition = "$isclauseis is $isclauseis";
      ifParser._parseCondition(condition).should.equal("context.isclauseis == context.isclauseis");

      condition = "$isclauseis == 'this is my isclause'";
      ifParser._parseCondition(condition).should.equal("context.isclauseis == 'this is my isclause'");
    });

    it('should correctly parse "neq"', function () {
      var condition = '$neqClause neq "neq is soo uneqe"';
      ifParser._parseCondition(condition).should.equal('context.neqClause != "neq is soo uneqe"');
    });

    it('should correctly parse "gt"', function () {
      var condition = '$gtClause gt 5';
      ifParser._parseCondition(condition).should.equal('context.gtClause > 5');
    });

    it('should correctly parse "lt"', function () {
      var condition = '$ltClause lt 5';
      ifParser._parseCondition(condition).should.equal('context.ltClause < 5');
    });
  });

  describe('#_evaluateCondition', function () {
    it('should evaluate a string condition', function () {
      var context = {
        'false': false,
        'value': 5,
        'isclauseis': 'this is the is clause'
      };

      var condition = "context.isclauseis === 'this is the is clause'";
      ifParser._evaluateCondition(condition, context).should.equal(true);
    });
  });
});