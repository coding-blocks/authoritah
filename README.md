# README

Authoritah is an unopinionated, tiny, library for node that provides a
convenient API for scrutinizing an object against a set of rules. This is used
internally at Coding Blocks for the authorization subsystems of various
applications, but is unopinionated enough to be useful in any scenario.

## Author

Prajjwal Singh

## Usage

Authoritah implements a rule based system, where a rule looks like this:

```javascript
{
  predicate: (x) => { ... },
  test: (x) => { ... }
}
```

Here, both `predicate()` and `test()` are **synchronous** functions returning
booleans. For each rule where the predicate returns `true` for the object under
scrutiny(supplied via `respect()`, see below), Authoritah ensures that the
corresponding `test()` returns a truthy value as well.

A sample rule used internally at Coding Blocks looks like this:

```javascript
const onlyAdminsCanDeleteRecords = {
  predicate: (request) => isDeleteRequest(request),
  test: (request) => currentUserIsAdmin(),
  httpErrorCode: 401,
  errorCode: 006
})
```

First, create a context:
```javascript
const A = new Authoritah()
```

To add the rule:

```javascript
A.addRule(onlyAdminsCanDeleteRecords)
```

`addRule()` also returns a boolean value indicating whether your rule was added
or not.

Finally, ensure every rule passes against object `x` with:

```javascript
A.respect(x)
```

This returns a boolean indicating whether every rule passed or not.

To check the number of rules that have been added, use `A.ruleCount()`.

To clear all existing rules (useful for switching contexts), use
`A.clearRules()`.

## Example

```javascript
const Authoritah = require('cb-authoritah') ;

let manBearPig = {
  species: "ManBearPig",
  manFraction: 0.5,
  bearFraction: 0.5,
  pigFraction: 0.5
}

let fakeManBearPig = {
  species: "ManBearPig",
  manFraction: 0.1,
  bearFraction: 0.1,
  pigFraction: 0.8
}

let notManBearPig = {
  species: "NotManBearPig"
}

// Instantiate a context. You can do this multiple times to create different
// contexts for different uses.
const A = new Authoritah()

// Create a Rule for only creatures whose species is "ManBearPig", asserting
// that all such creatures should be half man, half bear, and half pig.
//
// - You can add as many rules as you like.
// - A rule will not be added if it lacks the required properties, ie, either a
//   predicate, a test, or both.
A.addRule({

  // This function is used to decide whether or not to test an object against
  // the rule. Use this to add rules for only certain kinds of objects. An
  // example would be to limit a userIsAdmin() test to only DELETE requests in a
  // web app.
  predicate: (creature) => {
    return (creature.species === "ManBearPig")
  },

  // This is the actual test. For all rules where the predicate returns 'true'
  // for the object under scrutiny, this function is used to figure out whether
  // the object is valid or not.
  test: (creature) => {
    return (
      (creature.manFraction === 0.5) &&
      (creature.bearFraction === 0.5) &&
      (creature.pigFraction === 0.5)
    )
  },

  // You can attach extra payload to your objects, with things like error codes
  // and messages, etc. Just be sure to quack like a duck.
  errorMessage: "That's no ManBearPig!"
})

// Test various objects against the registered rules. This only returns true if
// ALL rules attached to an object pass.
A.respect(manBearPig) // => true
A.respect(fakeManBearPig) // => false
A.respect(notManBearPig) // => true, because the rule is only for ManBearPigs

// A much more useful method is disrespectedRules(), which returns a list of all
// rules that were violated. Sorry about the naming, but the south park
// references are more important than code comprehension.
A.disrespectedRules(manBearPig) // => []
A.disrespectedRules(fakeManBearPig) // => [{ ... }]

A
  .disrespectedRules(fakeManBearPig)[0]
  .errorMessage // => "That's no ManBearPig!"

A.disrespectedRules(notManBearPig) // => []

// Get the number of registered rules.
A.ruleCount() // => 1

// Clear all rules, and return the cleared ones
A.clearRules() // => [{ ... }, ...]
A.ruleCount() // => 0
```

## Running Tests

```
$> yarn test
```
