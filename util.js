const R = require('ramda')
;

const isNotNil = R.complement(R.isNil)

const nIfError = R.curry(
  (n, fn, args) => {
    try {
      return fn(args)
    }
    catch (error) {
      return n
    }
  }
)

const falseIfError = nIfError(false)

const assertRuleStructure = (rule) => {
  return (
    isNotNil(rule.predicate) &&
    isNotNil(rule.test)
  )
}

module.exports.nIfError = nIfError
module.exports.falseIfError = falseIfError
module.exports.assertRuleStructure = assertRuleStructure
