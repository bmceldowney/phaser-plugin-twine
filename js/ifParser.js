/*jshint -W054 */ // I know Function is a form of eval
function parse(text, context) {
  var ifIndex;
  var endIfIndex;
  var ifBlock;
  
  ifIndex = text.indexOf('<<if');

  if (ifIndex === -1) { return; }

  endIfIndex = text.lastIndexOf('<<endif');
  ifBlock = text.substring(ifIndex, endIfIndex + 9);
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