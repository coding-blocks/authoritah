const M = require('mocha'),
  C = require('chai'),
  R = require('ramda'),
  Authoritah = require('../index')
;

const should = C.should(),
  TIMEOUT = 1000,
  noop = R.always(undefined),
  A = new Authoritah(),

  ruleWithFalsePredicate = () => ({
    predicate: R.F,
    test: noop
  }),

  truthyRule = () => ({
    predicate: R.T,
    test: R.T
  }),

  falsyRule = () => ({
    predicate: R.T,
    test: R.F
  }),

  truthyRuleAsync = () => ({
    predicate: R.T,
    test: (request) => new Promise((resolve, reject) => {
      resolve()
    })
  }),

  falsyRuleAsync = () => ({
    predicate: R.T,
    test: (request) => new Promise((resolve, reject) => {
      reject()
    })
  })
;

describe ('it respects your authoritah', () => {
  beforeEach(() => A.clearRules())

  describe('rule adding', () => {
    it('should add a valid rule', (done) => {
      A.addRule(ruleWithFalsePredicate())
      A.addRule(truthyRule())
      A.addRule(falsyRule())

      A.ruleCount().should.equal(3)

      done()
    }).timeout(TIMEOUT)

    it('should not add an invalid rule', (done) => {
      A.addRule({ test: noop })
      A.addRule({ predicate: noop })

      A.ruleCount().should.equal(0)

      done()
    }).timeout(TIMEOUT)
  })

  it('should return true if there are no rules', (done) => {
    A.respect({ }).should.equal(true)
    done()
  }).timeout(TIMEOUT)

  it('should return false if a request is not supplied', (done) => {
    A.respect().should.equal(false)
    done()
  }).timeout(TIMEOUT)

  it('should be true if no predicates match in the supplied rules', (done) => {
    A.addRule(ruleWithFalsePredicate())
    A.addRule(ruleWithFalsePredicate())

    A.respect({ }).should.equal(true)

    done()
  }).timeout(TIMEOUT)

  describe('clearing rules', (done) => {
    it('should clear rules', (done) => {
      let rule = truthyRule()
      rule.watwat = 'wat'

      A.addRule(rule)

      A.ruleCount().should.equal(1)

      let clearedRules = A.clearRules()

      A.ruleCount().should.equal(0)

      R.length(clearedRules).should.equal(1)
      R.contains(rule, clearedRules).should.equal(true)

      done()
    }).timeout(TIMEOUT)
  })

  describe ('when a non-zero number of predicates match', () => {

    beforeEach(() => {
      A.clearRules()
      A.addRule(ruleWithFalsePredicate())
      R.map(
        A.addRule.bind(A),
        R.times(truthyRule, 5)
      )
    })

    it('should be true if all tests pass', (done) => {
      A.respect({ }).should.equal(true)

      done()
    }).timeout(TIMEOUT)

    it('should be false if even a single test fails', (done) => {
      A.addRule(falsyRule())
      A.respect({ }).should.equal(false)

      done()
    }).timeout(TIMEOUT)

    it('should return all violated rules', (done) => {
      let rule1 = falsyRule(),
        rule2 = falsyRule()

      rule1.errorCode = 1
      rule2.errorCode = 2

      A.addRule(rule1)
      A.addRule(rule2)

      let disrespectedRules = A.disrespectedRules({ })

      R.length(disrespectedRules).should.equal(2)
      R.contains(rule1, disrespectedRules).should.equal(true)
      R.contains(rule2, disrespectedRules).should.equal(true)

      done()
    }).timeout(TIMEOUT)
  })

  describe('async tests', () => {
    beforeEach(() => {
      A.clearRules()
      A.addRule(truthyRuleAsync())
    })

    it('should resolve if all tests resolve', (done) => {
      A.respectAsync({ })
        .then(result => done())
    })

    it('should be rejected if any one test rejects', (done) => {
      A.addRule(falsyRuleAsync())

      A.respectAsync({ })
        .catch(error => done())
    })
  })

  describe ('error handling', () => {
    beforeEach(() => {
      R.map(
        A.addRule.bind(A),
        R.times(truthyRule, 5)
      )
    })

    it('should not test rules where the predicate throws an error', (done) => {
      A.addRule({
        predicate: (request) => { throw "Wat" },
        test: R.F
      })

      A.respect({ }).should.equal(true)
      done()
    })

    it('it should be false when a test throws an error', (done) => {
      A.addRule({
        predicate: R.T,
        test: (request) => { throw "Wat" }
      })

      A.respect({ }).should.equal(false)
      done()
    })
  })
})
