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

function evaluateCondition(condition, context) {
  condition = condition.replace(/ is/, ' ===');
  condition = condition.replace(/\$/g, 'context.');
  condition = 'return '.concat(condition);

  var exec = new Function("context", condition);
  return exec(context);
}

module.exports = { 
  parse: parse,
  _getCondition: getCondition,
  _evaluateCondition: evaluateCondition
};