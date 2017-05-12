const R = require('ramda')

let rules = [ ]

const addRule = (rule) => {
  // TODO: Assert Rule Structure
  rules.push(rule)
}

const respect = (request) => {
  if (R.isNil(request)) return false;

  // TODO: Handle exceptions in both predicate and tests
  const matchingRules = R.filter(
    (rule) => rule.predicate(request)
  )

  const tests = R.pluck('test', matchingRules(rules))
  const allTestsPass = R.allPass(tests)

  return allTestsPass(request)
}

module.exports.addRule = addRule
module.exports.respect = respect
