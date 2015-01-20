//some dirty, dirty state
var openIfs;

function analyze(string) {
  var data = {
    macros: [],
    content: string
  };
  var macro, parentMacro;
  var macroCollection;
  var currentIf;

  openIfs = [];

  for (var index = 0; index < data.content.length; index++) {
    if (data.content[index] === '<' && data.content[index + 1] === '<') {
      if (macro && (macro.type === 'if' || macro.type === 'else')) {
        macro.content = data.content.slice(macro.endIndex + 1, index);
      }

      macro = lexMacro(data.content, index);
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

        currentIf.innerEndIndex = macro.startIndex;
        currentIf.contentStart = currentIf.endIndex;
        currentIf.endIndex = macro.endIndex;

        closeIf(currentIf);
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
  }

  data.contentStart = -1;
  closeIf(data);

  return data;
}

function closeIf (currentIf) {
  var tempContent;
  var child;

  if (!currentIf.macros) { return; }

  for (var i = currentIf.macros.length - 1; i >= 0; i--) {
    child = currentIf.macros[i]
    var offsetStart = child.startIndex - currentIf.contentStart;
    var offsetEnd = child.endIndex - currentIf.contentStart;

    tempContent = currentIf.content.slice(0, offsetStart - 1) +
          '<<' + i + '>>' +
          currentIf.content.slice(offsetEnd, currentIf.content.length);

    currentIf.content = tempContent;
  };
};

function lexMacro(story, index) {
  var macro = {};
  var tokens;
  var endIndex;

  endIndex = story.indexOf('>>', index);
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
  _lexMacro: lexMacro,
  _closeIf : closeIf
}