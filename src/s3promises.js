const R = require('ramda');
const P = require('bluebird');
const AWS = require('aws-sdk');

const S3 = new AWS.S3();

// --- Type Aliases ---
// type GetParams    = { Bucket: String, Key: String }
// type PutParams    = { Bucket: String,
//                       Key: String,
//                       Body: Buffer,
//                       ContentType: String
//                     }
// type GetResponse  = { Body: Buffer, ... }
// type PutResponse  = { ... }

// fetch : GetParams -> Promise(Response)
function fetch(params) {
  return new P((resolve, reject) => {
    S3.getObject(params, (err, response) => {
      if (err) reject(err);
      else resolve(response);
    });
  });
}

// put : PutParams -> Promise(PutResponse)
const put = params => new P((resolve, reject) => {
  S3.putObject(params, (err, response) => {
    if (err) reject(err);
    else resolve(response);
  });
});

// secure : GetParams -> Promise(SecureResponse)
const secure = params =>
  new P((resolve, reject) => {
    S3.putObjectAcl(params, (err, response) => {
      if (err) reject(err);
      else resolve(response);
    });
  });

// unwrapBody : { Body: Buffer, ... } -> Buffer
const unwrapBody = R.prop('Body');

module.exports = {
  fetch,
  put,
  secure,
  unwrapBody,
};
