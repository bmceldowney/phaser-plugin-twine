function analyze(string) {
  var story = string;
  var data = {
    macros: []
  };
  var index = 0;
  var macro;
  var openIfs = [];
  var macroCollection;

  while (story[index] !== undefined) {
    if (story[index] === '<' && story[index + 1] === '<') {
      macro = lexMacro(story, index);
      parentMacro = openIfs[openIfs.length - 1];

      if(macro.type === 'if') { 
        openIfs.push(macro);
      }

      if(macro.type === 'else') {
        if (!parentMacro.else) { parentMacro.else = [] }
        parentMacro.else.push(macro);
      }

      if(macro.type === 'endif') { 
        openIfs.pop().endIndex = macro.endIndex;
      }
      
      if (macro.type !== 'endif' && macro.type !== 'else') {
        if (parentMacro) {
          if (!parentMacro.macros) { parentMacro.macros = [] }
          macroCollection = parentMacro.macros;
        } else {
          macroCollection = data.macros;
        }

        macroCollection.push(macro);
      }
    }

    index++;
  }

  return data;
}

function lexMacro(story, index) {
  var macro = {};
  var tokens;
  var endIndex;

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

  return macro;
}

module.exports = {
  analyze: analyze,

  //for TDD
  _lexMacro: lexMacro
}