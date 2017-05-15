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

  matchingRules(request) {
    return R.filter(
      (rule) => U.falseIfError(rule.predicate, request),
      this.rules
    )
  }

  disrespectedRules(request) {
    if (R.isNil(request)) return false;

    const disrespectedRules = R.filter(
      (rule) => (! U.falseIfError(rule.test, request)),
      this.matchingRules(request)
    )

    return disrespectedRules
  }

  respect(request) {
    return R.equals(
      0,
      R.length(this.disrespectedRules(request))
    )
  }

  respectAsync(request) {
    let tests = R.pluck('test', this.matchingRules(request))
    return Promise.all(
      (R.map(fn => fn(request), tests))
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
