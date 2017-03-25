/*
 * A test context to fullfil the contract of AWS Lambda.
 */

exports.context = {
  done: function(err, data) {
    if (err) console.error(err);
    else console.log(data);
  },

  success: function(data) {
    console.log(data);
  },

  fail: function(err) {
    console.error(err);
  }
};
