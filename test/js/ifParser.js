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

  describe('#_evaluateCondition', function () {
    it('should correctly evaluate "is"', function () {
      var context = {
        'false': false,
        'value': 5,
        'isclauseis': 'this is the is clause'
      };

      var condition = '$false is true';
      ifParser._evaluateCondition(condition, context).should.equal(false);

      condition = '$value is 5';
      ifParser._evaluateCondition(condition, context).should.equal(true);

      condition = "$isclauseis is 'this is the is clause'";
      ifParser._evaluateCondition(condition, context).should.equal(true);

      condition = "$isclauseis is $isclauseis";
      ifParser._evaluateCondition(condition, context).should.equal(true);
    });
  });
});