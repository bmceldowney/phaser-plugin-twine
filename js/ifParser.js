/*jshint -W054 */ // I know Function is a form of eval
function parse(macro, context) {
  var elseIndex = 0;
  var retval = '';
  var expression;

  expression = parseExpression(macro.expression);
  retval = evaluateExpression(expression, context) ? macro.content : '';

  if (retval !== '') { return retval; }
  
  while (elseIndex < macro.else.length && retval === '') {
    expression = parseExpression(macro.else[elseIndex].expression);
    retval = evaluateExpression(expression, context) ? macro.else[elseIndex].content : '';
    if (retval !== '') { return retval; }
    
    elseIndex++;
  }

  return retval;
}

function parseExpression(expression) {
  var operatorMap = {
    is  : '==',
    neq : '!=',
    gt  : '>',
    lt  : '<',
    and : '&&',
    or  : '||'
  };

  expression = expression.replace(/\$/g, 'context.');
  var matches = expression.match(/('.*?'|".*?"|\S+)/g);
  if (!matches) { return true; } // no expression, let it pass

  for (var i = 0; i < matches.length; i++) {
    matches[i] = operatorMap[matches[i]] || matches[i];
  }

  expression = matches.join(' ');
  return expression;
}

function evaluateExpression(expression, context) {
  var innerExpression = 'return '.concat(expression);
  var exec = new Function("context", innerExpression);

  return exec(context);
}

module.exports = { 
  parse: parse,
  _parseExpression: parseExpression,
  _evaluateExpression: evaluateExpression
};