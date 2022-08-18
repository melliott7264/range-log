const { Schema, model } = require('mongoose');

// Basic firearm definition
const firearmSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  barrelLength: {
    type: Number,
  },
  caliber: {
    type: Number,
  },
  ignitionType: {
    type: String,
  },
  diaTouchHole: {
    type: Number,
  },
  // The following information is for a future front sight height calculation
  diaRearSight: {
    type: Number,
  },
  diaFrontSight: {
    type: Number,
  },
  heightRearSight: {
    type: Number,
  },
  heightFrontSight: {
    type: Number,
  },
  sightRadius: {
    type: Number,
  },
  // This associates the firearm with a particular user
  userId: {
    type: Schema.Types.ObjectId,
  },
});

const Firearm = model('Firearm', firearmSchema);

module.exports = Firearm;
