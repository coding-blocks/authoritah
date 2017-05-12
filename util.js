const R = require('ramda')
;

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

module.exports.nIfError = nIfError
module.exports.falseIfError = falseIfError
