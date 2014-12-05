var openIfs = [];

function analyze(string) {
  var story = string;
  var data = {
    macros: {}
  };
  var index = 0;
  var macro;

  while (story[index] !== undefined) {
    if (story[index] === '<' && story[index + 1] === '<') {
      macro = lexMacro(story, index);
      index = macro.endIndex;
      
      if (macro.type !== 'endif' && macro.type !== 'else') {
        if (!data.macros[macro.type]) { data.macros[macro.type] = [] }

        data.macros[macro.type].push(macro);
      }
    } else {
      index++;
    }
  }

  return data;
}

function lexMacro(story, index) {
  var macro = {};
  var tokens;
  var endIndex;
  var parentMacro;

  endIndex = story.indexOf('>', index);
  tokens = story.substring(index + 2, endIndex);
  tokens = tokens.split(' ');
  macro.type = tokens.shift();

  if(macro.type === 'else' && tokens[0] === 'if') {
    tokens.shift();
  }

  if(macro.type === 'elseif') {
    macro.type = 'else';
  }

  macro.expression = tokens.join(' ');
  macro.startIndex = index;
  macro.endIndex = endIndex + 1;

  if(macro.type === 'if') { 
    openIfs.push(macro);
    macro.depth = openIfs.length;
  }

  if(macro.type === 'else') {
    parentMacro = openIfs[openIfs.length - 1];
    if (!parentMacro.else) { parentMacro.else = [] }
    parentMacro.else.push(macro);
  }

  if(macro.type === 'endif') { 
    openIfs.pop().endIndex = endIndex + 1;
  }

  return macro;
}

module.exports = {
  analyze: analyze,

  //for TDD
  _lexMacro: lexMacro
}