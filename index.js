const R = require('ramda'),
  U = require('./util')
;

let rules = [ ]

const addRule = (rule) => {
  if (U.assertRuleStructure(rule)) {
    rules.push(rule)
    return true;
  }
  else {
    return false;
  }
}

const respect = (request) => {
  if (R.isNil(request)) return false;

  const matchingRules = R.filter(
    (rule) => U.falseIfError(rule.predicate, request)
  )

  const tests = R.map(
    (test) => U.falseIfError(test),
    R.pluck('test', matchingRules(rules))
  )

  const allTestsPass = R.allPass(tests)

  return allTestsPass(request)
}

const clearRules = () => rules = [ ]

const ruleCount = () => {
  return R.length(rules)
}

module.exports.clearRules = clearRules
module.exports.addRule = addRule
module.exports.respect = respect
module.exports.ruleCount = ruleCount
