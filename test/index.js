const M = require('mocha'),
  C = require('chai'),
  R = require('ramda'),
  A = require('../index')
;

const should = C.should(),
  TIMEOUT = 1000,
  alwaysTrue = R.always(true),
  alwaysFalse = R.always(false),
  noop = R.always(undefined)
;

const ruleWithFalsePredicate = () => ({
  predicate: alwaysFalse,
  test: noop
})

const truthyRule = (Authoritah) => ({
    predicate: alwaysTrue,
    test: alwaysTrue
})

const falsyRule = (Authoritah) => ({
    predicate: alwaysTrue,
    test: alwaysFalse
})

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

  describe ('when a non-zero number of predicates match', () => {

    beforeEach(() => {
      A.clearRules()
      A.addRule(ruleWithFalsePredicate())
      R.map(
        A.addRule,
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

  })

  describe ('error handling', () => {
    beforeEach(() => {
      R.map(
        A.addRule,
        R.times(truthyRule, 5)
      )
    })

    it('should not test rules where the predicate throws an error', (done) => {
      A.addRule({
        predicate: (request) => { throw "Wat" },
        test: alwaysFalse
      })

      A.respect({ }).should.equal(true)
      done()
    })

    it('it should be false when a test throws an error', (done) => {
      A.addRule({
        predicate: alwaysTrue,
        test: (request) => { throw "Wat" }
      })

      A.respect({ }).should.equal(false)
      done()
    })
  })
})
