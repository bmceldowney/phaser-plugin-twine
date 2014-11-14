function Story(storyData, context) {
  this._data = this._buildDictionary(storyData.data);
  this._context = context;
}

var story = Story.prototype;

story._buildDictionary = function (data) {
  var dictionary = {};

  for (var i = 0; i < data.length; i++) {
    if (data[i].title.indexOf('::') !== -1) { data[i].title = data[i].title.replace("﻿:: ", ''); }
    dictionary[data[i].title.toString()] = data[i];
  }

  return dictionary;
};

story._parseText = function (text) {
  
};

module.exports = Story;