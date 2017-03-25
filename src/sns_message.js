const R = require('ramda');

// records -> { Records: a } -> a | []
const records = R.propOr([], 'Records');

// nthOr : a -> Number -> [b] -> b | a
const nthOr = R.curry((thing, i, data) => R.nth(i, data) || thing);

// first : [a] -> a | {}
const first = nthOr({}, 0);

// sns : { Sns: a } -> a | {}
const sns = R.propOr({}, 'Sns');

// message : { Message: a } -> a | {}
const message = R.prop('Message');

// unwrap :
const unwrap = R.compose(message, sns, first, records);

// message : Object -> Object
exports.message = (event) => {
  const msg = unwrap(event);
  if (msg) {
    return JSON.parse(msg);
  }
  return event;
};
