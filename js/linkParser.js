function parse(text) {
  var regex = /\[\[[^\]]+\]\]/g;
  var links = [];

  text.match(regex).forEach(function (link) {
    var tuple = link.split('|');
    var value;
    
    if (tuple.length > 1) {
      links.push({
        displayText: tuple[0].replace('[[', ''),
        passageTitle: tuple[1].replace(']]', '')
      });
    } else {
      value = tuple[0].replace('[[', '').replace(']]', '');

      links.push({
        displayText: value,
        passageTitle: value
      });
    }
  });

  return links;
}

module.exports = { parse: parse };