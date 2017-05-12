# README

Authoritah is an unopinionated, tiny authorization library for node
applications. This is used internally at Coding Blocks for the authorization
subsystems of various applications, but is unopinionated enough to be useful in
any scenario where you need to enforce a set of rules on an object.

## Author

Prajjwal Singh

## Usage

Authoritah implements a rule based system, where a rule looks like this:

    {
      predicate: (x) => { ... },
      test: (x) => { ... }
    }

Here, both `predicate()` and `test()` are synchronous functions returning
booleans. For each rule where the predicate returns `true` for the object under
scrutiny(supplied via `respect()`, see below), Authoritah ensures that the
corresponding `test()` returns a truthy value as well.

A sample rule used internally at Coding Blocks looks like this:

    const onlyAdminsCanDeleteRecords = {
      predicate: (request) => isDelete(request),
      test: (request) => currentUserIsAdmin(response)
    })

To add the rule:

     Authoritah.addRule(onlyAdminsCanDeleteRecords)

`addRule()` also returns a boolean value indicating whether your rule was added
or not.

Finally, ensure every rule passes against object `x` with:

    Authoritah.respect(x)

This returns a boolean indicating whether every rule passed or not.

To check the number of rules that have been added, use `Authoritah.ruleCount()`.

To clear all existing rules (useful for switching contexts), use
`Authoritah.clearRules()`.

## Running Tests

    $> yarn test
