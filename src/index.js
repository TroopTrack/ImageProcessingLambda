/*
 * An AWS lambda entry point. Processes images as they are added to s3 and
 * resizes them based on which image is added.
 */
const R = require('ramda');
const P = require('bluebird');
const LE = require('./s3events');
const T = require('./transform');
const S3 = require('./s3promises');
const path = require('path');
const sns = require('./sns_message');

const processableImages = R.compose(LE.processableImages, sns.message);

// changeTypeKey : String -> String -> String
const changeTypeKey = R.curry(
  (key, replacement) => `${path.dirname(path.dirname(key))}/${replacement}/${path.basename(key)}`,
);

// outputKey : Record -> String
function outputKey(record) {
  const newKey = changeTypeKey(LE.s3Key(record));
  if (LE.isOriginal(record)) {
    return newKey('full');
  } else if (LE.isFull(record)) {
    return newKey('large');
  } else if (LE.isLarge(record)) {
    return newKey('medium');
  }

  // else if (LE.isMedium(record)) {
  return newKey('small');
}

// secureParams : Record -> PutResponse -> SecureParams
const secureParams = R.curry(record => ({
  Bucket: LE.bucketName(record),
  Key: outputKey(record),
  ACL: 'private',
}));

// uploadParams : Record -> Buffer -> UploadParams
const uploadParams = R.curry((record, buffer) => ({
  Bucket: LE.bucketName(record),
  Key: outputKey(record),
  Body: buffer,
}));

// transform : Record -> Promise(Buffer)
const transform = (record) => {
  if (LE.isOriginal(record)) {
    return T.full(LE.s3Key(record));
  } else if (LE.isFull(record)) {
    return T.large(LE.s3Key(record));
  } else if (LE.isLarge(record)) {
    return T.medium(LE.s3Key(record));
  }
  // if (LE.isMedium(record)) {
  return T.small(LE.s3Key(record));
};

// getParams : Record -> GetParams
const getParams = R.curry(record => ({
  Bucket: LE.bucketName(record),
  Key: LE.s3Key(record),
}));

// processImage : Record -> Promise(Result)
const processImage = record =>
  S3.fetch(getParams(record))
    .then(thing => S3.unwrapBody(thing))
    .then(transform(record))
    .then(uploadParams(record))
    .then(S3.put)
    .then(secureParams(record))
    .then(S3.secure);

exports.handler = (event, context) => {
  P.all(R.map(processImage, processableImages(event))).done(
    (result) => {
      context.done(null, result);
    },
    (err) => {
      context.done(err, null);
    },
  );
};
