function analyze(string) {
  var story = string;
  var data = {
    macros: []
  };
  var index = 0;
  var macro, parentMacro;
  var openIfs = [];
  var macroCollection;
  var currentIf;
  var tempContent;

  while (story[index] !== undefined) {
    if (story[index] === '<' && story[index + 1] === '<') {
      macro = lexMacro(story, index);
      parentMacro = openIfs[openIfs.length - 1];

      if(macro.type === 'if') { 
        macro.innerStartIndex = macro.endIndex;
        openIfs.push(macro);
      }

      if(macro.type === 'else') {
        if (!parentMacro.else) { parentMacro.else = [] }
        parentMacro.else.push(macro);
      }

      if(macro.type === 'endif') {
        currentIf = openIfs.pop();

        currentIf.content = story.slice(currentIf.endIndex + 1, macro.startIndex);

        currentIf.innerEndIndex = macro.startIndex;
        currentIf.contentStart = currentIf.endIndex;
        currentIf.endIndex = macro.endIndex;

        if (parentMacro) {
          var offsetStart = macro.startIndex - parentMacro.contentStart;
          var offsetEnd = macro.endIndex - parentMacro.contentStart;

          tempContent = parentMacro.content.slice(0, offsetStart) +
                '<<' + 0
                //(parentMacro.macros.length - 1) +
                '>>' +
                parentMacro.content.slice(offsetEnd, parentMacro.content.length - 1);

          parentMacro.content = tempContent;
        };
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