var chai = require('chai');
var Story;

var should = chai.should();

describe('Story', function () {
  var story;
  var context;
  var storyData;

  beforeEach(function () {
    Story = require('../index.js');
    storyData = {
      data: [
        {
          "tags": [],
          "text": "I've got a job for you, if you're looking.\n\n[[Sure|Description]]\n[[Not right now|End]]",
          "created": "201411122019",
          "modified": "201411122019",
          "title": "﻿:: Start",
          "modifier": "twee"
        },
        {
          "tags": [],
          "text": "I’ve got a shipment of goods that never made it out of the docks.\n\nI need someone to go out and “convince” the dockmaster to release my property.\n\n<<if $reputation>>\nYou seem like just the type for this sort of thing.\n<<endif>>\n\n[[Why can’t you talk to him?|Why]]\n[[What’s it worth to you?|HowMuch]]",
          "created": "201411122019",
          "modified": "201411122019",
          "title": "Description",
          "modifier": "twee"
        }
      ]};

    context = {};
    story = new Story(storyData, context);
  });

  describe('#ctor', function () {
    it('should initialize the story object', function () {
      story._data.should.have.property('Description');
      story._data.should.have.property('Start');
      story._context.should.equal(context);
    });
  });

  describe('#_buildDictionary', function () {
    it('should convert a data array into a dictionary keyed on title', function () {
      var dictionary = story._buildDictionary(storyData.data);
      dictionary.should.have.property('Description');
      dictionary.should.have.property('Start');
    });
  });

  xdescribe('#_parseText', function () {
    it('should return a text object', function () {
      var text = story._parseText(storyData.data[1].text);
      text.should.have.property('links');
      text.links.length.should.equal(2);
    });
  });

  describe('#start', function () {
    it('should ');
  });
});