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

const hasPredicate = R.has('predicate')
const hasTest = R.has('test')

const assertRuleStructure = (rule) => {
  return (
    hasPredicate(rule) &&
    hasTest(rule)
  )
}

module.exports.nIfError = nIfError
module.exports.falseIfError = falseIfError
module.exports.assertRuleStructure = assertRuleStructure
