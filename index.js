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
    (rule) => {
      try {
        return rule.predicate(request)
      }
      catch (error) {
        return false
      }
    }
  )

  const tests = R.map(
    (test) => (request) => {
      try {
        return test(request)
      }
      catch (error) {
        return false
      }
    },
    R.pluck('test', matchingRules(rules))
  )

  const allTestsPass = R.allPass(tests)

  return allTestsPass(request)
}

const clearRules = () => rules = [ ]

module.exports.clearRules = clearRules;
module.exports.addRule = addRule
module.exports.respect = respect
