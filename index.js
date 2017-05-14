const R = require('ramda'),
  U = require('./util')
;

let rules = [ ]

const addRule = (rule) => {
  let isRuleValid = U.assertRuleStructure(rule)

  if (isRuleValid) {
    rules.push(rule)
  }

  return isRuleValid
}

const disrespectedRules = (request) => {
  if (R.isNil(request)) return false;

  const matchingRules = R.filter(
    (rule) => U.falseIfError(rule.predicate, request)
  )

  const disrespectedRules = R.filter(
    (rule) => (! U.falseIfError(rule.test, request)),
    matchingRules(rules)
  )

  return disrespectedRules
}

const respect = (request) => {
  return R.equals(
    0,
    R.length(disrespectedRules(request))
  )
}

const clearRules = () => rules = [ ]

const ruleCount = () => {
  return R.length(rules)
}

module.exports.clearRules = clearRules
module.exports.addRule = addRule
module.exports.disrespectedRules = disrespectedRules
module.exports.respect = respect
module.exports.ruleCount = ruleCount
