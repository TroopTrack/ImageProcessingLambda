/*
 * This module extracts and modifies data that is found in S3 events.
 */
const R = require('ramda');
const path = require('path');

// isImageKey :: String -> Boolean
const isImageKey = R.compose(
  R.flip(R.any)(['.jpg', '.jpeg', '.png', '.gif']),
  R.equals,
  R.toLower,
  path.extname,
);

// isPhotosFolderKey : String -> Boolean
const isPhotosFolderKey = R.compose(R.equals('photos'), R.nth(0), R.split('/'));

// isMeritBadgeTrackerFolderKey : String -> Boolean
const isMeritBadgeTrackerFolderKey = R.compose(
  R.equals('merit_badge_trackers'),
  R.nth(0),
  R.split('/'),
);

// isImageFolderKey : String -> Boolean
const isImageFolderKey = key => R.or(isPhotosFolderKey(key), isMeritBadgeTrackerFolderKey(key));

// decodeUri :: String -> String
const decodeUri = R.compose(decodeURIComponent, R.replace(/\+/g, ' '));

// s3Key :: Record -> String
const s3Key = R.compose(decodeUri, R.prop('key'), R.prop('object'), R.prop('s3'));

// isImageFolder : Record -> Boolean
const isImageFolder = record => isImageFolderKey(s3Key(record));

// bucketName : Record -> String
const bucketName = R.compose(R.prop('name'), R.prop('bucket'), R.prop('s3'));

// isImage :: Record -> Boolean
const isImage = R.compose(isImageKey, s3Key);

// records :: Event -> [Record]
const records = R.prop('Records');

// imageRecords :: Event -> [Record]
const imageRecords = R.compose(R.filter(isImage), R.filter(isImageFolder), records);

// isImageSize : String -> Record -> Boolean
const isImageSize = R.curry((sizeName, record) => {
  const key = s3Key(record);
  const dirname = path.basename(path.dirname(key));
  return R.equals(dirname, sizeName);
});

// isOriginal : Record -> Boolean
const isOriginal = isImageSize('original');

// isFull : Record -> Boolean
const isFull = isImageSize('full');

// isLarge : Record -> Boolean
const isLarge = isImageSize('large');

// isMedium : Record -> Boolean
const isMedium = isImageSize('medium');

// isSmall : Record -> Boolean
const isSmall = isImageSize('small');

// processableImages : Event -> [Records]
const processableImages = R.compose(R.filter(R.complement(isSmall)), imageRecords);

module.exports = {
  isImage,
  isImageKey,
  bucketName,
  s3Key,
  imageRecords,
  processableImages,
  isOriginal,
  isFull,
  isLarge,
  isMedium,
  isSmall,
};
