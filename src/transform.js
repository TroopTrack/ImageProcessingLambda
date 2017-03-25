/*
 * This module performs image transformations and wraps them up
 * as promises so we can chain them into another promise chain.
 */
const gm = require('gm').subClass({ imageMagick: true });
const R = require('ramda');
const P = require('bluebird');

// Type aliases
// type Dimensions = { x: Number, y: Number }

// transform : Dimensions -> String -> Buffer -> Task(Error, Buffer)
const transform = R.curry(
  (dim, imageName, buffer) =>
    new P((resolve, reject) => {
      gm(buffer, imageName).autoOrient().resize(dim.x, dim.y).toBuffer((err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    }),
);

// full : String -> Buffer -> Task(Error, Buffer)
const full = transform({ x: 2400, y: 2400 });

// large : String -> Buffer -> Task(Error, Buffer)
const large = transform({ x: 800, y: 800 });

// medium : String -> Buffer -> Task(Error, Buffer)
const medium = transform({ x: 240, y: 160 });

// small : String -> Buffer -> Task(Error, Buffer)
const small = transform({ x: 100, y: 100 });

module.exports = {
  transform,
  full,
  large,
  medium,
  small,
};
