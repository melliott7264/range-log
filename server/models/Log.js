const { Schema, model, SchemaTypes } = require('mongoose');
const Firearm = require('./Firearm');

// Log definition by user, date, target, and shot.   There will also be an associted firearm.
const logSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  // target and shot are integers
  target: {
    type: Number,
    required: true,
  },
  shot: {
    type: Number,
    required: true,
  },
  firearmId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  targetType: {
    type: String,
  },
  targetDistance: {
    type: Number,
  },
  shootingPosition: {
    type: String,
  },
  // The measure system is either false: English or true: Metric
  measureSystem: {
    type: Boolean,
    default: false,
  },
  // Start log entries for date
  // temperature is an integer in Fahrenheit or Celsius
  temperature: {
    type: Number,
  },
  // humidity is an integer in percent
  humidity: {
    type: Number,
  },
  // windspeed in an integer in MPH or KPH
  windSpeed: {
    type: Number,
  },
  // North, NorthEast, East, SouthEast, South, SouthWest, West, or NorthWest
  windDirection: {
    type: String,
    trim: true,
  },
  // End log entries for date
  // Score info: Ring number, X, and orientation on clockface
  scoreRing: {
    type: Number,
  },
  scoreX: {
    type: Boolean,
    default: false,
  },
  scoreOrientation: {
    type: Number,
  },
  // End Score info
  // Start Shot information
  // projectile type is a Boolean true:round or false:conical
  projectileType: {
    type: Boolean,
    default: true,
  },
  // projectileDiameter is a decimal number in inches or mm
  projectileDiameter: {
    type: Number,
  },
  // projectileWeight is in grains or grams
  projectileWeight: {
    type: Number,
  },
  patchMaterial: {
    type: String,
    trim: true,
  },
  // patchThickness is a decimal number either inches or mm
  patchThickness: {
    type: Number,
  },
  patchLube: {
    type: String,
    trim: true,
  },
  powderBrand: {
    type: String,
    trim: true,
  },
  // powderGrade will be either FF, FFF, or FFFF
  powderGrade: {
    type: String,
    trim: true,
  },
  powderLot: {
    type: String,
    trim: true,
  },
  // charge is an integer in grains
  powderCharge: {
    type: Number,
  },
});

const Log = model('Log', logSchema);

module.exports = Log;
