const { Schema, model } = require('mongoose');

// Log definition by user, date, target, and shot.   There will also be an associted firearm.
const logSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  target: {
    type: Number,
  },
  shot: {
    type: Number,
  },
  firearmId: {
    type: Schema.Types.ObjectId,
  },
  // Start log entries for date
  temperature: {
    type: Number,
  },
  // temperatureScale will be either true:Fahrenheit or false: Celsius Boolean
  temperatureScale: {
    type: Boolean,
    default: true,
  },
  // humidity in percent
  humidity: {
    type: Number,
  },
  windSpeed: {
    type: Number,
  },
  // windSpeedScale will be Boolean either true:MPH or false:KPH
  windSpeedScale: {
    type: Boolean,
    default: true,
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
  // shot measurements will either be inch or mm selected by measureSystem Boolean true:inch, false: mm
  measureSystem: {
    type: Boolean,
  },
  // projectile type is a Boolean true:round or false:conical
  projectileType: {
    type: Boolean,
    default: true,
  },
  // projectileDiameter is a decimal number in inches or mm
  projectileDiameter: {
    type: Number,
  },
  // projectileWeight is in grains
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
  // charge is in grains
  powderCharge: {
    type: Number,
  },
});

const Log = model('Log', logSchema);

module.exports = Log;
