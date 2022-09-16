const { AuthenticationError } = require('apollo-server-express');
const User = require('../models/User');
const Firearm = require('../models/Firearm');
const Log = require('../models/Log');

const { signToken } = require('../utils/auth');
const { find } = require('../models/User');

const resolvers = {
  Query: {
    // return all the users - for testing only!
    users: async (parent, args, context) => {
      const userData = await User.find({}).select('-password -__v');
      console.log(userData);
      return userData;
    },

    me: async (parent, args, context) => {
      if (context.user) {
        const me = await User.find({ _id: context.user._id }).select(
          '-password -__v'
        );
        return me;
      }
      throw new AuthenticationError('Not Logged In');
    },

    firearmsByUser: async (parent, args, context) => {
      if (context.user) {
        const firearms = await Firearm.find({ userId: context.user._id });
        return firearms;
      }
      throw new AuthenticationError('Not Logged In');
    },

    firearm: async (parent, { _id }, context) => {
      if (context.user) {
        const firearm = await Firearm.find().and([
          { userId: context.user._id },
          { _id: _id },
        ]);
        return firearm;
      }
      throw new AuthenticationError('Not Logged In');
    },

    logsByUser: async (parent, args, context) => {
      if (context.user) {
        const logEntry = await Log.find({ userId: context.user._id });
        return logEntry;
      }
      throw new AuthenticationError('Not Logged In');
    },

    logsByDate: async (parent, { date }, context) => {
      if (context.user) {
        const logEntry = await Log.find().and([
          { userId: context.user._id },
          { date: date },
        ]);
        return logEntry;
      }
      throw new AuthenticationError('Not Logged In');
    },

    logsByTarget: async (parent, { date, target }, context) => {
      if (context.user) {
        const logEntry = await Log.find({
          $and: [
            { userId: context.user._id },
            { date: date },
            { target: target },
          ],
        });
        return logEntry;
      }
      throw new AuthenticationError('Not Logged In');
    },

    logsByShot: async (parent, { date, target, shot }, context) => {
      if (context.user) {
        const logEntry = await Log.find({
          $and: [
            { userId: context.user._id },
            { date: date },
            { target: target },
            { shot: shot },
          ],
        });
        console.log(logEntry);
        return logEntry;
      }
      throw new AuthenticationError('Not Logged In');
    },
    logDates: async (parent, args, context) => {
      if (context.user) {
        const logDates = await Log.find().select('date');
        console.log(logDates);
        return logDates;
      }
      throw new AuthenticationError('Not Logged In');
    },
    logTargetsByDate: async (parent, { date }, context) => {
      if (context.user) {
        const logTargets = await Log.find({ date: date }).select('target -_id');
        console.log(logTargets);
        return logTargets;
      }
    },
    logShotsByTargetDate: async (parent, { date, target }, context) => {
      if (context.user) {
        const logShots = await Log.find({
          $and: [{ date: date }, { target: target }],
        }).select('shot -_id');
        console.log(logShots);
        return logShots;
      }
      throw AuthenticationError('Not Logged In');
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    addFirearm: async (
      parent,
      {
        name,
        measureSystem,
        barrelLength,
        caliber,
        ignitionType,
        diaTouchHole,
        diaRearSight,
        diaFrontSight,
        heightRearSight,
        heightFrontSight,
        sightRadius,
      },
      context
    ) => {
      if (context.user) {
        const firearm = await Firearm.create({
          userId: context.user._id,
          name: name,
          measureSystem: measureSystem,
          barrelLength: barrelLength,
          caliber: caliber,
          ignitionType: ignitionType,
          diaTouchHole: diaTouchHole,
          diaRearSight: diaRearSight,
          diaFrontSight: diaFrontSight,
          heightRearSight: heightRearSight,
          heightFrontSight: heightFrontSight,
          sightRadius: sightRadius,
        });
        return firearm;
      }
      throw new AuthenticationError('Not Logged In');
    },

    editFirearm: async (
      parent,
      {
        _id,
        name,
        measureSystem,
        barrelLength,
        caliber,
        ignitionType,
        diaTouchHole,
        diaRearSight,
        diaFrontSight,
        heightRearSight,
        heightFrontSight,
        sightRadius,
      },
      context
    ) => {
      if (context.user) {
        const firearm = Firearm.findOneAndUpdate(
          { _id: _id },
          {
            name: name,
            measureSystem: measureSystem,
            barrelLength: barrelLength,
            caliber: caliber,
            ignitionType: ignitionType,
            diaTouchHole: diaTouchHole,
            diaRearSight: diaRearSight,
            diaFrontSight: diaFrontSight,
            heightRearSight: heightRearSight,
            heightFrontSight: heightFrontSight,
            sightRadius: sightRadius,
          },
          { new: true }
        );
        return firearm;
      }
      throw new AuthenticationError('Not Logged In');
    },

    addLogEntry: async (
      parent,
      {
        date,
        target,
        shot,
        firearmId,
        measureSystem,
        temperature,
        humidity,
        windSpeed,
        windDirection,
        scoreRing,
        scoreX,
        scoreOrientation,
        projectileType,
        projectileDiameter,
        projectileWeight,
        patchMaterial,
        patchThickness,
        patchLube,
        powderBrand,
        powderGrade,
        powderLot,
        powderCharge,
      },
      context
    ) => {
      if (context.user) {
        const logEntry = await Log.create({
          userId: context.user._id,
          date: date,
          target: target,
          shot: shot,
          firearmId: firearmId,
          measureSystem: measureSystem,
          temperature: temperature,
          humidity: humidity,
          windSpeed: windSpeed,
          windDirection: windDirection,
          scoreRing: scoreRing,
          scoreX: scoreX,
          scoreOrientation: scoreOrientation,
          projectileType: projectileType,
          projectileDiameter: projectileDiameter,
          projectileWeight: projectileWeight,
          patchMaterial: patchMaterial,
          patchThickness: patchThickness,
          patchLube: patchLube,
          powderBrand: powderBrand,
          powderGrade: powderGrade,
          powderLot: powderLot,
          powderCharge: powderCharge,
        });
        return logEntry;
      }
      throw new AuthenticationError('Not Logged In');
    },

    editLogEntry: async (
      parent,
      {
        _id,
        date,
        target,
        shot,
        firearmId,
        measureSystem,
        temperature,
        humidity,
        windSpeed,
        windDirection,
        scoreRing,
        scoreX,
        scoreOrientation,
        projectileType,
        projectileDiameter,
        projectileWeight,
        patchMaterial,
        patchThickness,
        patchLube,
        powderBrand,
        powderGrade,
        powderLot,
        powderCharge,
      },
      context
    ) => {
      if (context.user) {
        const logEntry = await Log.findOneAndUpdate(
          { _id: _id },
          {
            date: date,
            target: target,
            shot: shot,
            firearmId: firearmId,
            measureSystem: measureSystem,
            temperature: temperature,
            humidity: humidity,
            windSpeed: windSpeed,
            windDirection: windDirection,
            scoreRing: scoreRing,
            scoreX: scoreX,
            scoreOrientation: scoreOrientation,
            projectileType: projectileType,
            projectileDiameter: projectileDiameter,
            ProjectileWeight: projectileWeight,
            patchMaterial: patchMaterial,
            patchThickness: patchThickness,
            patchLube: patchLube,
            powderBrand: powderBrand,
            powderGrade: powderGrade,
            powderLot: powderLot,
            powderCharge: powderCharge,
          },
          { new: true }
        );
        return logEntry;
      }
      throw new AuthenticationError('Not Logged In');
    },

    removeFirearm: async (parrent, { _id }, context) => {
      if (context.user) {
        const firearm = await Firearm.findOneAndDelete({ _id: _id });
        return firearm;
      }
      throw new AuthenticationError('Not Logged In');
    },

    removeLogEntry: async (parent, { _id }, context) => {
      if (context.user) {
        const logEntry = await Log.findOneAndDelete({ _id: _id });
        return logEntry;
      }
      throw new AuthenticationError('Not Logged In');
    },
  },
};

module.exports = resolvers;
