/*jshint -W054 */ // I know Function is a form of eval
function parse(text, context) {
  var ifIndex;
  var endIfIndex;
  var ifBlock;
  var condition;

  ifIndex = text.indexOf('<<if');

  if (ifIndex === -1) { return; }

  endIfIndex = text.lastIndexOf('<<endif');
  ifBlock = text.substring(ifIndex, endIfIndex + 9);
  condition = getCondition(ifBlock);


}

function getCondition(ifBlock) {
  var ifClose = ifBlock.indexOf('>>');
  return ifBlock.substring(5, ifClose);
}

function parseCondition(condition) {
  condition = condition.replace(/ is /, ' === ');
  condition = condition.replace(/\$/g, 'context.');

  return condition;
}

function evaluateCondition(condition, context) {
  var innerCondition = 'return '.concat(condition);
  var exec = new Function("context", innerCondition);

  return exec(context);
}

module.exports = { 
  parse: parse,
  _getCondition: getCondition,
  _parseCondition: parseCondition,
  _evaluateCondition: evaluateCondition
};