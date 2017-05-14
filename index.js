const R = require('ramda'),
  U = require('./util')
;

class Authoritah {
  constructor() {
    this.rules = [ ]
  }

  addRule(rule) {
    let isRuleValid = U.assertRuleStructure(rule)

    if (isRuleValid) {
      this.rules.push(rule)
    }

    return isRuleValid
  }

  disrespectedRules(request) {
    if (R.isNil(request)) return false;

    const matchingRules = R.filter(
      (rule) => U.falseIfError(rule.predicate, request)
    )

    const disrespectedRules = R.filter(
      (rule) => (! U.falseIfError(rule.test, request)),
      matchingRules(this.rules)
    )

    return disrespectedRules
  }

  respect(request) {
    return R.equals(
      0,
      R.length(this.disrespectedRules(request))
    )
  }

  clearRules() {
    let clearedRules = this.rules
    this.rules = [ ]
    return clearedRules
  }

  ruleCount() {
    return R.length(this.rules)
  }
}

module.exports = Authoritah
