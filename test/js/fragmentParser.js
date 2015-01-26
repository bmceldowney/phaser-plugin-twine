var chai = require('chai');
var should = chai.should();

describe('fragmentParser',
 function () {
  var parser;
  var data;
  var context;

  beforeEach(function () {
    parser = require('../../js/fragmentParser.js');
    context = {
      reputation: -1
    };
    data = {
      "macros": [
        {
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
              "expression": "",
              "startIndex": 161,
              "endIndex": 168,
              "content": "\nI'm apprehensive, but willing to give you a try.\n"
            }
          ],
          "type": "if",
          "expression": "$reputation > 4",
          "startIndex": 12,
          "endIndex": 227,
          "innerStartIndex": 33,
          "content": "\nYou seem like just the type for this sort of thing.\n",
          "contentStart": 33
        }
      ],
      "links": [
        {
          "startIndex": 230,
          "text": "Why can’t you talk to him?",
          "target": "Why",
          "endIndex": 263
        },
        {
          "startIndex": 265,
          "text": "What’s it worth to you?",
          "target": "HowMuch",
          "endIndex": 299
        }
      ],
      "content": "This content<<0>>\n\n[[Why can’t you talk to him?|Why]]\n[[What’s it worth to you?|HowMuch]]\n",
      "contentStart": -1
    };
  });

  describe('#parse', function () {
    it('should parse a story fragment', function () {
      parser.parse(data);
    });
  });
});
