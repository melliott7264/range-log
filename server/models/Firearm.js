const { Schema, model } = require('mongoose');

// Basic firearm definition
const firearmSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  // measurement system true: Metric or false: English
  measureSystem: {
    type: Boolean,
    default: false,
  },
  // barrel length is to be an integer in inches or cm
  barrelLength: {
    type: Number,
  },
  // a decimal in inches or mm
  caliber: {
    type: Number,
  },
  ignitionType: {
    type: String,
  },
  // a decimal in inches or mm
  diaTouchHole: {
    type: Number,
  },
  // The following information is for a future front sight height calculation
  // measurements are decimal in inches or mm
  // diameter of the barrel at the rear sight
  diaRearSight: {
    type: Number,
  },
  // diameter of the barrel at the front sight
  diaFrontSight: {
    type: Number,
  },
  heightRearSight: {
    type: Number,
  },
  heightFrontSight: {
    type: Number,
  },
  // The decimal distance in inches or cm from the top of the front sight to the top of the rear sight
  sightRadius: {
    type: Number,
  },
  // This associates the firearm with a particular user
  userId: {
    type: Schema.Types.ObjectId,
  },
  distanceToTarget: {
    type: Number,
  },
  muzzleVelocity: {
    type: Number,
  },
});

const Firearm = model('Firearm', firearmSchema);

module.exports = Firearm;
